import type { Metadata } from "next";
import { ModuleLanding } from "@/components/module-landing";
import { requireModule } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "HR" };

export default async function Page() {
  const user = await requireModule("hr");
  return <ModuleLanding module="hr" user={user} />;
}
