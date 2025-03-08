
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { ContributionViewToggle } from "@/components/admin/ContributionViewToggle";
import { ContributionsTable } from "@/components/admin/ContributionsTable";
import { ContributionsKanban } from "@/components/admin/ContributionsKanban";

export const ContributionsPage = () => {
  const [view, setView] = useState<"list" | "kanban">("list");

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

        {view === "list" ? (
          <ContributionsTable />
        ) : (
          <ContributionsKanban />
        )}
      </div>
    </DashboardLayout>
  );
};
