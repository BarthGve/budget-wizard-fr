
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de compte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileSettings />
          <SecuritySettings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
