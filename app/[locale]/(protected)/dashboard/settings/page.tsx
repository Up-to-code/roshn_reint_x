import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";

export const metadata = constructMetadata({
  title: "Settings – Next Template",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage({ params }: { params: { locale: string } }) {
  const user = await getCurrentUser();
  const locale = params.locale || "en";

  if (!user?.id) redirect(`/${locale}/login`);

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <DeleteAccountSection />
      </div>
    </>
  );
}
