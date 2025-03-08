
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { ContributionViewToggle } from "@/components/admin/ContributionViewToggle";
import { ContributionsTable } from "@/components/admin/ContributionsTable";
import { ContributionsKanban } from "@/components/admin/ContributionsKanban";
import { useContributions } from "@/hooks/useContributions";

export const ContributionsPage = () => {
  const [view, setView] = useState<"table" | "kanban">("table");
  
  const {
    filteredContributions,
    setSelectedContribution,
    handleStatusUpdate,
    deleteContribution,
    updateStatus,
    handleDragEnd
  } = useContributions();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contributions</h1>
            <p className="text-muted-foreground">
              Gérez et suivez les contributions des utilisateurs
            </p>
          </div>
          <ContributionViewToggle view={view} onChange={setView} />
        </div>

        {view === "table" ? (
          <ContributionsTable 
            contributions={filteredContributions}
            onViewDetails={(contribution) => setSelectedContribution(contribution)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={deleteContribution}
            onUpdateStatus={updateStatus}
          />
        ) : (
          <ContributionsKanban 
            contributions={filteredContributions}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContributionsPage;
