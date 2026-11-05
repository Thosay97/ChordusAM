import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

/** Phase 0 protected endpoint: 200 for roles with access to the "vendor_payments" module, otherwise 401/403. */
export async function GET() {
  const auth = await guardApi({ module: "vendor_payments" });
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({
    module: "vendor_payments",
    ok: true,
    user: { id: auth.id, role: auth.role },
  });
}
