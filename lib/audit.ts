import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuditEvent {
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
}

/**
 * Writes one row to `public.audit_log` through the `write_audit` database function.
 * The database sets the actor from the signed-in user, so callers cannot fake it.
 * Table-level triggers also audit sensitive tables directly; use this for actions
 * that are not a single row change (for example "download payslip" or "import committed").
 */
export async function writeAudit(event: AuditEvent): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return; // demo mode: nothing to write to
  const { error } = await supabase.rpc("write_audit", {
    p_action: event.action,
    p_entity: event.entity,
    p_entity_id: event.entityId ?? null,
    p_before: event.before ?? null,
    p_after: event.after ?? null,
  });
  if (error) throw new Error(`Audit write failed: ${error.message}`);
}
