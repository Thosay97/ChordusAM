import Link from "next/link";
import { Logo } from "@/components/logo";
import { ModuleNav } from "@/components/module-nav";
import { requireUser } from "@/lib/auth/guards";
import { ROLE_LABELS, homePathFor, modulesFor } from "@/lib/auth/roles";
import { isDemoMode } from "@/lib/env";
import { signOut } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const modules = modulesFor(user).map(({ key, label, href }) => ({ key, label, href }));

  return (
    <div className="flex min-h-screen flex-col">
      {isDemoMode() && (
        <div className="bg-gold text-ink px-4 py-1 text-center text-xs font-semibold">
          Demo mode: no database connected, nothing is saved.
        </div>
      )}
      <header className="bg-burgundy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-3">
          <Link href={homePathFor(user)} className="text-xl">
            <Logo />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-right leading-tight sm:block">
              <span className="block font-medium">{user.fullName}</span>
              <span className="block text-xs text-white/70">{user.email}</span>
            </span>
            <span
              data-testid="role-badge"
              className="bg-gold text-ink rounded px-2 py-0.5 text-xs font-bold"
            >
              {ROLE_LABELS[user.role]}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded border border-white/30 px-2 py-1 text-xs hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-2 pt-2 sm:px-4">
          <ModuleNav items={modules} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <footer className="text-ink/50 px-4 py-4 text-center text-xs">
        Alliance Media Company (Private) Limited · Colombo
      </footer>
    </div>
  );
}
