import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
const Settings = () => {
  return <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h2 className="font-bold tracking-tight text-3xl">Paramètres Du Compte</h2>
          <p className="text-muted-foreground">
            Gérez vos paramètres de compte et préférences
          </p>
        </div>

        <div className="space-y-10">
          <ProfileSettings />
          <SecuritySettings />
          <NotificationSettings />
          <PaymentSettings />
          <PrivacySettings />
        </div>
      </div>
    </DashboardLayout>;
};
export default Settings;