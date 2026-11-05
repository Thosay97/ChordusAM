import type { Metadata } from "next";
import { ModuleLanding } from "@/components/module-landing";
import { requireModule } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Vendor Payments" };

export default async function Page() {
  const user = await requireModule("vendor_payments");
  return <ModuleLanding module="vendor_payments" user={user} />;
}
