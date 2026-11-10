/**
 * Roles, modules and the access matrix (PLAN.md section 2 and section 8).
 *
 * This file is the single source of truth for "who can open which module" in
 * the app layer. The database enforces the same rules again with Row Level
 * Security, so hiding a menu item here is never the only protection.
 */

export const ROLES = ["employee", "hr", "admin", "finance"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  employee: "Employee",
  hr: "HR",
  admin: "Admin",
  finance: "Finance",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** The signed-in user as the app sees them. Role always comes from the database. */
export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  /** Extra permission from PLAN.md section 2: producers, coordinators etc. */
  canRequestPayments: boolean;
  active: boolean;
}

export const MODULE_KEYS = ["self_service", "hr", "vendor_payments", "finance", "admin"] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];

export interface ModuleFeature {
  label: string;
  phase: number;
}

export interface ModuleDefinition {
  key: ModuleKey;
  label: string;
  href: string;
  description: string;
  /** Roles that always have access. */
  roles: readonly Role[];
  /** Upcoming features, shown on the module landing page as a roadmap. */
  features: readonly ModuleFeature[];
}

export const MODULES: Record<ModuleKey, ModuleDefinition> = {
  self_service: {
    key: "self_service",
    label: "My Workspace",
    href: "/me",
    description: "Your attendance, leave balances, requests and pay statements.",
    roles: ROLES,
    features: [
      { label: "My month calendar", phase: 2 },
      { label: "Mark missed attendance", phase: 3 },
      { label: "Request leave and see balances", phase: 4 },
      { label: "My pay statements", phase: 7 },
    ],
  },
  hr: {
    key: "hr",
    label: "HR",
    href: "/hr",
    description: "Employees, contracts, attendance import, leave and payroll preparation.",
    roles: ["hr", "admin"],
    features: [
      { label: "Employees, contract types and holidays", phase: 1 },
      { label: "Fingerprint attendance import", phase: 2 },
      { label: "Manual attendance comments", phase: 3 },
      { label: "Leave review", phase: 4 },
      { label: "Monthly payroll preparation", phase: 7 },
    ],
  },
  vendor_payments: {
    key: "vendor_payments",
    label: "Vendor Payments",
    href: "/vendor-payments",
    description: "Payment requests for artists, freelancers and suppliers, with numbered vouchers.",
    roles: ["hr", "admin", "finance"],
    features: [
      { label: "Vendor directory", phase: 5 },
      { label: "Payment requests and spending limit routing", phase: 5 },
      { label: "Payment voucher and self-billed invoice PDFs", phase: 5 },
      { label: "Finance payables queue", phase: 5 },
    ],
  },
  finance: {
    key: "finance",
    label: "Finance",
    href: "/finance",
    description: "Income, expenses, receivables, P&L and cash reports.",
    roles: ["finance", "admin"],
    features: [
      { label: "Expenses, recurring expenses and categories", phase: 6 },
      { label: "Clients, income and receivables ageing", phase: 6 },
      { label: "P&L, project profitability and cash view", phase: 6 },
      { label: "Payroll handoff and auto-posting", phase: 7 },
    ],
  },
  admin: {
    key: "admin",
    label: "Admin",
    href: "/admin",
    description: "Approvals, overview dashboards, settings and the audit trail.",
    roles: ["admin"],
    features: [
      { label: "Contract type and policy settings", phase: 1 },
      { label: "Approvals inbox", phase: 3 },
      { label: "Payments inbox", phase: 5 },
      { label: "Overview dashboards", phase: 8 },
      { label: "Audit log viewer", phase: 9 },
    ],
  },
};

/** Can this user open this module? Inactive users can open nothing. */
export function canAccessModule(user: SessionUser, module: ModuleKey): boolean {
  if (!user.active) return false;
  if (MODULES[module].roles.includes(user.role)) return true;
  // Employees with the "can request payments" permission get Vendor Payments
  // (they will only see their own requests once Phase 5 lands).
  if (module === "vendor_payments" && user.canRequestPayments) return true;
  return false;
}

/** Modules to show in the navigation, in a fixed order. */
export function modulesFor(user: SessionUser): ModuleDefinition[] {
  return MODULE_KEYS.filter((key) => canAccessModule(user, key)).map((key) => MODULES[key]);
}

/** Where each role lands after signing in. */
export function homePathFor(user: SessionUser): string {
  switch (user.role) {
    case "admin":
      return MODULES.admin.href;
    case "hr":
      return MODULES.hr.href;
    case "finance":
      return MODULES.finance.href;
    case "employee":
      return MODULES.self_service.href;
  }
}
