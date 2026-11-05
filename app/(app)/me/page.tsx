import type { Metadata } from "next";
import { ModuleLanding } from "@/components/module-landing";
import { requireModule } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "My Workspace" };

export default async function Page() {
  const user = await requireModule("self_service");
  return <ModuleLanding module="self_service" user={user} />;
}
