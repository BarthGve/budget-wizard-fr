
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExpenseCategoriesSettings } from "@/components/settings/ExpenseCategoriesSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { RetailersSettings } from "@/components/settings/RetailersSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            Gérez vos paramètres de compte et préférences
          </p>
        </div>

        <div className="space-y-10">
          <ProfileSettings />
          <RetailersSettings />
          <ExpenseCategoriesSettings />
          <SecuritySettings />
          <NotificationSettings />
          <PaymentSettings />
          <PrivacySettings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
