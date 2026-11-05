import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { homePathFor } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await requireUser();
  redirect(homePathFor(user));
}
