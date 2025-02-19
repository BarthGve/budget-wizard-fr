import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";

const Expenses = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dépenses</h1>
        </div>
        <Card className="p-4">
          <p>Page des dépenses en construction</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
