
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FeedbackViewToggle } from "@/components/admin/FeedbackViewToggle";
import { FeedbacksTable } from "@/components/admin/FeedbacksTable";
import { FeedbacksKanban } from "@/components/admin/FeedbacksKanban";
import { FeedbackSearch } from "@/components/admin/FeedbackSearch";
import { useState } from "react";

const AdminFeedbacks = () => {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Retours d'expérience</h1>
            <p className="text-muted-foreground">
              Gérez les retours et suggestions des utilisateurs
            </p>
          </div>
          <div className="flex items-center gap-4">
            <FeedbackSearch onSearch={setSearchTerm} />
            <FeedbackViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {view === "list" ? (
          <FeedbacksTable searchTerm={searchTerm} />
        ) : (
          <FeedbacksKanban searchTerm={searchTerm} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbacks;
