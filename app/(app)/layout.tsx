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
        <div className="bg-gold/15 text-soft-gold border-gold/30 border-b px-4 py-1.5 text-center font-mono text-[0.62rem] tracking-[0.24em] uppercase">
          Demo mode · no database connected · nothing is saved
        </div>
      )}

      {/* Floating liquid-glass header, after the website's nav. */}
      <header className="sticky top-3 z-50 px-3 pt-3 sm:px-4">
        <div className="glass mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 rounded-[28px] bg-[rgb(58_16_32/0.45)] px-3 py-2.5 lg:flex-nowrap lg:rounded-full lg:py-2 lg:pl-5">
          <Link href={homePathFor(user)} className="order-1 shrink-0 text-base">
            <Logo size={34} />
          </Link>

          <div className="order-3 w-full lg:order-2 lg:w-auto lg:flex-1 lg:justify-center lg:overflow-hidden">
            <ModuleNav items={modules} />
          </div>

          <div className="order-2 ml-auto flex items-center gap-2 lg:order-3 lg:ml-0">
            <span className="hidden text-right leading-tight xl:block">
              <span className="block text-sm font-medium">{user.fullName}</span>
              <span className="text-muted block text-xs">{user.email}</span>
            </span>
            <span
              data-testid="role-badge"
              className="border-gold/40 bg-gold/15 text-soft-gold rounded-full border px-3 py-1 font-mono text-[0.6rem] tracking-[0.22em] uppercase"
            >
              {ROLE_LABELS[user.role]}
            </span>
            <form action={signOut}>
              <button type="submit" className="btn btn-glass btn-sm">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-10 pb-16 sm:px-6">{children}</main>

      <footer className="border-gold/20 border-t px-4 py-6">
        <div className="text-muted mx-auto flex max-w-6xl flex-wrap justify-between gap-2 font-mono text-[0.62rem] tracking-[0.14em]">
          <span>© 2026 Alliance Media Company. Colombo, SL.</span>
          <span>ChordusAM · internal use only</span>
        </div>
      </footer>
    </div>
  );
}
