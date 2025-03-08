
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminFeedbacks = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retours d'expérience</h1>
          <p className="text-muted-foreground">Gérez les retours et suggestions des utilisateurs</p>
        </div>

        <div className="p-6 bg-gray-100 rounded-lg flex items-center justify-center h-64">
          <p className="text-center text-gray-500">Liste des feedbacks utilisateurs</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbacks;
