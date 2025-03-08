
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FeedbackViewToggle } from "@/components/admin/FeedbackViewToggle";
import { FeedbacksTable } from "@/components/admin/FeedbacksTable";
import { FeedbacksKanban } from "@/components/admin/FeedbacksKanban";
import { FeedbackSearch } from "@/components/admin/FeedbackSearch";
import { useState } from "react";
import { useFeedbacks } from "@/hooks/useFeedbacks";

const AdminFeedbacks = () => {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "read" | "published" | "all">("all");
  
  const { 
    feedbacks, 
    isLoading,
    setSelectedFeedback,
    handleStatusUpdate,
    deleteFeedback,
    approveFeedback,
    unapproveFeedback,
    handleDragEnd 
  } = useFeedbacks();

  // Filtrer les feedback en fonction du terme de recherche et du statut
  const filteredFeedbacks = feedbacks?.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

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
            <FeedbackSearch 
              search={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
            <FeedbackViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <FeedbackSearch 
          search={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {view === "table" ? (
          <FeedbacksTable 
            feedbacks={filteredFeedbacks}
            onViewDetails={(feedback) => setSelectedFeedback(feedback)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={deleteFeedback}
            onApprove={approveFeedback}
            onUnapprove={unapproveFeedback}
          />
        ) : (
          <FeedbacksKanban 
            feedbacks={filteredFeedbacks}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbacks;
