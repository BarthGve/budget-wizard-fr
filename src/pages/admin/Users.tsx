
import { UserTable } from "@/components/admin/UserTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminUsers = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gestion des utilisateurs</h1>
          <p className="text-lg text-muted-foreground">
            Gérez les utilisateurs, leurs rôles et leurs profils
          </p>
        </div>
        
        <UserTable />
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
