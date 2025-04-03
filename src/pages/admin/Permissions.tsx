
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PagePermissionsTable } from "@/components/admin/PagePermissionsTable";

const AdminPermissions = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gestion des permissions</h1>
          <p className="text-lg text-muted-foreground">
            Définissez quelles pages sont accessibles aux utilisateurs standard et premium
          </p>
        </div>
        
        <PagePermissionsTable />
      </div>
    </DashboardLayout>
  );
};

export default AdminPermissions;
