import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ROLE_LABEL } from "@/lib/rbac";
import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm, ChangePasswordForm } from "@/components/admin/profile-forms";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader title="Meu perfil" description="Dados da sua conta e segurança.">
        <Badge variant="primary">{ROLE_LABEL[user.role]}</Badge>
      </PageHeader>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Dados</h2>
        <ProfileForm user={user} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Segurança</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
