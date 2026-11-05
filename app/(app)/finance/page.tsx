import type { Metadata } from "next";
import { ModuleLanding } from "@/components/module-landing";
import { requireModule } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Finance" };

export default async function Page() {
  const user = await requireModule("finance");
  return <ModuleLanding module="finance" user={user} />;
}
