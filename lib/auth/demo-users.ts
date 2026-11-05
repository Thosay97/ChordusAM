import type { SessionUser } from "./roles";

/**
 * The four demo users from PLAN.md Phase 0. The same list is used by demo mode
 * and by `npm run seed:users`, which creates them in a real Supabase project.
 */
export const DEMO_USERS: readonly SessionUser[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    email: "employee@chordusam.test",
    fullName: "Demo Employee",
    role: "employee",
    canRequestPayments: false,
    active: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    email: "hr@chordusam.test",
    fullName: "Demo HR",
    role: "hr",
    canRequestPayments: true,
    active: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    email: "admin@chordusam.test",
    fullName: "Demo Admin",
    role: "admin",
    canRequestPayments: true,
    active: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    email: "finance@chordusam.test",
    fullName: "Demo Finance",
    role: "finance",
    canRequestPayments: false,
    active: true,
  },
];

export const DEMO_COOKIE = "chordus_demo_user";

export function findDemoUser(id: string | undefined): SessionUser | null {
  if (!id) return null;
  return DEMO_USERS.find((u) => u.id === id) ?? null;
}
