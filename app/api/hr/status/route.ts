import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

/** Phase 0 protected endpoint: 200 for roles with access to the "hr" module, otherwise 401/403. */
export async function GET() {
  const auth = await guardApi({ module: "hr" });
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ module: "hr", ok: true, user: { id: auth.id, role: auth.role } });
}
