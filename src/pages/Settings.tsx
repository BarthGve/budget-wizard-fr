
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";

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
      </div>
    </DashboardLayout>
  );
};

export default Settings;
