import { getOrCreateProfile } from "@/lib/data";
import { AppearanceManager } from "@/components/admin/AppearanceManager";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage() {
  const profile = await getOrCreateProfile();
  return <AppearanceManager initialProfile={profile} />;
}
