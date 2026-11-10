"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
}

/** Module switcher. Only receives the modules the server decided this user may open. */
export function ModuleNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On a phone the pills scroll sideways; keep the current module in view.
  useEffect(() => {
    navRef.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      aria-label="Modules"
      className="flex [scrollbar-width:none] gap-1 overflow-x-auto lg:justify-center"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[0.68rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300 ${
              active
                ? "text-soft-gold bg-white/12 shadow-[inset_0_0_0_1px_rgb(245_166_35/0.35)]"
                : "text-cream/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
