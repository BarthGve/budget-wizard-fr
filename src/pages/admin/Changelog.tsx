
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Changelog = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal des modifications</h1>
          <p className="text-muted-foreground">Consultez et gérez les changements apportés à l'application</p>
        </div>

        <div className="p-6 bg-gray-100 rounded-lg flex items-center justify-center h-64">
          <p className="text-center text-gray-500">Journal des modifications</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Changelog;
