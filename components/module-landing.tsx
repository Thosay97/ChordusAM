import { MODULES, type ModuleKey, type SessionUser } from "@/lib/auth/roles";

/** Phase 0 landing page for a module: what it is for and what is coming, by build phase. */
export function ModuleLanding({ module, user }: { module: ModuleKey; user: SessionUser }) {
  const def = MODULES[module];
  return (
    <section>
      <h1 className="text-burgundy text-2xl font-bold">{def.label}</h1>
      <p className="text-ink/70 mt-1">{def.description}</p>
      <p className="mt-4 text-sm">
        Signed in as <strong>{user.fullName}</strong>.
      </p>

      <h2 className="text-ink/60 mt-8 mb-3 text-sm font-semibold tracking-wide uppercase">
        Coming in this module
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {def.features.map((f) => (
          <li
            key={f.label}
            className="border-ink/10 flex items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3"
          >
            <span className="text-sm">{f.label}</span>
            <span className="bg-tint text-burgundy shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold">
              Phase {f.phase}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
