
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RetailersSettings } from "@/components/settings/RetailersSettings";
import { ExpenseCategoriesSettings } from "@/components/settings/ExpenseCategoriesSettings";

const Classification = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Classification</h2>
          <p className="text-muted-foreground">
            Gérez vos enseignes et catégories de dépenses
          </p>
        </div>

        <div className="space-y-10">
          <RetailersSettings />
          <ExpenseCategoriesSettings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Classification;
