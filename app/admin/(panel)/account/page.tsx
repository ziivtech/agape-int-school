import { requirePageArea } from "@/lib/auth/page";
import AccountForm from "@/components/admin/AccountForm";
import { PageHeader } from "@/components/admin/ui";

export default async function AccountPage() {
  const session = await requirePageArea("dashboard");
  return (
    <>
      <PageHeader title="My account" description={`${session.name} · ${session.email}`} />
      <AccountForm />
    </>
  );
}
