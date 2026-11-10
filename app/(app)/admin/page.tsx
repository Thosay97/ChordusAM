import type { Metadata } from "next";
import { ModuleLanding } from "@/components/module-landing";
import { requireModule } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Admin" };

export default async function Page() {
  const user = await requireModule("admin");
  return <ModuleLanding module="admin" user={user} />;
}
