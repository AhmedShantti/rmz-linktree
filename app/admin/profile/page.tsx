import { getOrCreateProfile } from "@/lib/data";
import { ProfileManager } from "@/components/admin/ProfileManager";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getOrCreateProfile();
  return <ProfileManager initialProfile={profile} />;
}
