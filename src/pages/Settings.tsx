
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de compte
          </p>
        </div>

        <ProfileSettings />
        <SecuritySettings />
        <NotificationSettings />
        <PaymentSettings />
        <PrivacySettings />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
