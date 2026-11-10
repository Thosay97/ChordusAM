/**
 * Row Level Security tests against a real Postgres.
 * Runs only when DATABASE_URL_TEST is set (CI starts a Postgres service for it).
 * WARNING: the target database's public and auth schemas are dropped and recreated.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.DATABASE_URL_TEST;
const root = path.resolve(__dirname, "../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

const IDS = {
  employee: "10000000-0000-4000-8000-000000000001",
  hr: "10000000-0000-4000-8000-000000000002",
  admin: "10000000-0000-4000-8000-000000000003",
  finance: "10000000-0000-4000-8000-000000000004",
  admin2: "10000000-0000-4000-8000-000000000005",
} as const;
type Who = keyof typeof IDS;

describe.skipIf(!url)("RLS: profiles and audit_log", () => {
  let db: Client;

  /** Run fn as a signed-in user inside a transaction that is always rolled back. */
  async function as<T>(who: Who | "anon", fn: (c: Client) => Promise<T>): Promise<T> {
    await db.query("begin");
    try {
      if (who === "anon") {
        await db.query("set local role anon");
      } else {
        await db.query("set local role authenticated");
        await db.query("select set_config('request.jwt.claims', $1, true)", [
          JSON.stringify({ sub: IDS[who], role: "authenticated" }),
        ]);
      }
      return await fn(db);
    } finally {
      await db.query("rollback");
    }
  }

  async function resetSchema() {
    await db.query("drop schema if exists public cascade; drop schema if exists auth cascade;");
    await db.query("create schema public;");
    await db.query(read("tests/db/supabase-stub.sql"));
  }

  beforeAll(async () => {
    db = new Client({ connectionString: url });
    await db.connect();
    await resetSchema();
    const migrations = readdirSync(path.join(root, "supabase/migrations")).sort();
    for (const file of migrations) await db.query(read(`supabase/migrations/${file}`));

    // Seed as the migration owner (auth.uid() is null, like the service role).
    for (const [who, id] of Object.entries(IDS)) {
      await db.query(
        "insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)",
        // Try to self-assign admin through signup metadata; it must be ignored.
        [id, `${who}@x.test`, JSON.stringify({ full_name: who, role: "admin" })],
      );
      const role = who === "admin2" ? "admin" : who;
      await db.query("update public.profiles set role = $2 where id = $1", [id, role]);
    }
  });

  afterAll(async () => {
    await db?.end();
  });

  it("creates profiles as employee regardless of signup metadata", async () => {
    await db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)", [
      "20000000-0000-4000-8000-000000000001",
      "sneaky@x.test",
      JSON.stringify({ role: "admin" }),
    ]);
    const { rows } = await db.query(
      "select role from public.profiles where email = 'sneaky@x.test'",
    );
    expect(rows[0].role).toBe("employee");
  });

  it("employee sees only their own profile", async () => {
    const rows = await as(
      "employee",
      async (c) => (await c.query("select id from public.profiles")).rows,
    );
    expect(rows.map((r) => r.id)).toEqual([IDS.employee]);
  });

  it.each(["hr", "admin", "finance"] as const)("%s sees all profiles", async (who) => {
    const n = await as(
      who,
      async (c) => (await c.query("select count(*)::int n from public.profiles")).rows[0].n,
    );
    expect(n).toBeGreaterThanOrEqual(5);
  });

  it("anon sees nothing and cannot read profiles", async () => {
    await expect(as("anon", (c) => c.query("select * from public.profiles"))).rejects.toThrow(
      /permission denied/,
    );
  });

  it("a user can change their own name", async () => {
    const name = await as("employee", async (c) => {
      await c.query("update public.profiles set full_name = 'New Name' where id = $1", [
        IDS.employee,
      ]);
      return (await c.query("select full_name from public.profiles where id = $1", [IDS.employee]))
        .rows[0].full_name;
    });
    expect(name).toBe("New Name");
  });

  it("a user cannot promote themselves", async () => {
    await expect(
      as("employee", (c) =>
        c.query("update public.profiles set role = 'admin' where id = $1", [IDS.employee]),
      ),
    ).rejects.toThrow(/Only an Admin/);
  });

  it("HR cannot change roles", async () => {
    await expect(
      as("hr", (c) => c.query("update public.profiles set role = 'admin' where id = $1", [IDS.hr])),
    ).rejects.toThrow(/Only an Admin/);
  });

  it("a user cannot update someone else's profile (RLS hides the row)", async () => {
    const count = await as(
      "employee",
      async (c) =>
        (await c.query("update public.profiles set full_name = 'x' where id = $1", [IDS.hr]))
          .rowCount,
    );
    expect(count).toBe(0);
  });

  it("an Admin can change roles and the change is audited", async () => {
    const audit = await as("admin", async (c) => {
      await c.query("update public.profiles set role = 'hr' where id = $1", [IDS.employee]);
      return (
        await c.query(
          "select actor_id, action, before->>'role' b, after->>'role' a from public.audit_log where entity = 'profiles' and entity_id = $1 order by at desc limit 1",
          [IDS.employee],
        )
      ).rows[0];
    });
    expect(audit).toEqual({ actor_id: IDS.admin, action: "update", b: "employee", a: "hr" });
  });

  it("inactive users lose their role", async () => {
    await db.query("begin");
    try {
      await db.query("update public.profiles set active = false where id = $1", [IDS.hr]);
      await db.query("set local role authenticated");
      await db.query("select set_config('request.jwt.claims', $1, true)", [
        JSON.stringify({ sub: IDS.hr }),
      ]);
      const { rows } = await db.query("select public.current_app_role() r");
      expect(rows[0].r).toBeNull();
      const { rows: visible } = await db.query("select id from public.profiles");
      expect(visible.map((r) => r.id)).toEqual([IDS.hr]);
    } finally {
      await db.query("rollback");
    }
  });

  describe("audit_log", () => {
    it("only Admins can read it", async () => {
      for (const who of ["employee", "hr", "finance"] as const) {
        const n = await as(
          who,
          async (c) => (await c.query("select count(*)::int n from public.audit_log")).rows[0].n,
        );
        expect(n, who).toBe(0);
      }
      const n = await as(
        "admin",
        async (c) => (await c.query("select count(*)::int n from public.audit_log")).rows[0].n,
      );
      expect(n).toBeGreaterThan(0);
    });

    it("nobody can insert directly", async () => {
      await expect(
        as("admin", (c) =>
          c.query("insert into public.audit_log (actor_id, action, entity) values ($1, 'x', 'y')", [
            IDS.hr,
          ]),
        ),
      ).rejects.toThrow(/permission denied/);
    });

    it("write_audit records the caller as actor", async () => {
      const row = await as("hr", async (c) => {
        const { rows } = await c.query(
          "select public.write_audit('test.action', 'thing', '42') id",
        );
        await c.query("reset role");
        return (
          await c.query("select actor_id, action from public.audit_log where id = $1", [rows[0].id])
        ).rows[0];
      });
      expect(row).toEqual({ actor_id: IDS.hr, action: "test.action" });
    });

    it("write_audit refuses anonymous callers", async () => {
      await expect(
        as("anon", (c) => c.query("select public.write_audit('x', 'y')")),
      ).rejects.toThrow(/permission denied/);
    });

    it("is append only, even for the table owner", async () => {
      await expect(db.query("update public.audit_log set action = 'tampered'")).rejects.toThrow(
        /append only/,
      );
      await expect(db.query("delete from public.audit_log")).rejects.toThrow(/append only/);
      await expect(db.query("truncate public.audit_log")).rejects.toThrow(/append only/);
    });
  });

  it("the rollback script removes everything and the migration re-applies", async () => {
    await db.query(read("supabase/rollbacks/20261105000000_phase0_foundation.down.sql"));
    const { rows } = await db.query(
      "select count(*)::int n from information_schema.tables where table_schema = 'public'",
    );
    expect(rows[0].n).toBe(0);
    await db.query(read("supabase/migrations/20261105000000_phase0_foundation.sql"));
  });
});
