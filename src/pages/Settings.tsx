
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { ExpenseCategoriesSettings } from "@/components/settings/ExpenseCategoriesSettings";

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

        <div className="grid gap-6 md:grid-cols-3">
  <div className="md:col-span-2 space-y-6">
    <ProfileSettings />
    <SecuritySettings />
  </div>
  <div>
    <ExpenseCategoriesSettings />
  </div>
</div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;
