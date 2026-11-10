import { MODULES, type ModuleKey, type SessionUser } from "@/lib/auth/roles";

/** Splits "Vendor Payments" into "Vendor" + "Payments" so the last word can take the gold italic. */
function splitTitle(label: string): [string, string] {
  const i = label.lastIndexOf(" ");
  return i === -1 ? ["", label] : [label.slice(0, i), label.slice(i + 1)];
}

/** Phase 0 landing page for a module: what it is for and what is coming, by build phase. */
export function ModuleLanding({ module, user }: { module: ModuleKey; user: SessionUser }) {
  const def = MODULES[module];
  const [lead, last] = splitTitle(def.label);

  return (
    <section>
      <div className="rise">
        <span className="eyebrow">Signed in as {user.fullName}</span>
        <h1 className="font-display mt-4 text-5xl leading-[0.92] font-semibold tracking-[-0.01em] uppercase sm:text-7xl">
          {lead && <>{lead} </>}
          <em className="gold-text font-medium">{last}</em>
        </h1>
        <p className="text-cream/80 mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
          {def.description}
        </p>
      </div>

      <div className="rise mt-12" style={{ "--d": "0.12s" } as React.CSSProperties}>
        <span className="eyebrow">Coming in this module</span>
      </div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {def.features.map((f, i) => (
          <li
            key={f.label}
            className="glass rise rounded-[26px] px-6 py-5"
            style={{ "--d": `${0.16 + i * 0.06}s` } as React.CSSProperties}
          >
            <span className="text-gold font-mono text-[0.62rem] tracking-[0.24em] uppercase">
              Phase {f.phase}
            </span>
            <h2 className="font-display mt-2 text-2xl leading-tight font-semibold italic">
              {f.label}
            </h2>
          </li>
        ))}
      </ul>
    </section>
  );
}
