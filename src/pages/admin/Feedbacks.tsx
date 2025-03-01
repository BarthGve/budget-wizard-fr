
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackDetailsDialog } from "@/components/admin/FeedbackDetailsDialog";
import { FeedbackHeader } from "@/components/admin/feedback-header/FeedbackHeader";
import { FeedbackContent } from "@/components/admin/feedback-content/FeedbackContent";
import { useFeedbacks } from "@/hooks/useFeedbacks";

export const AdminFeedbacks = () => {
  const {
    page,
    setPage,
    view,
    setView,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedFeedback,
    setSelectedFeedback,
    filteredFeedbacks,
    totalPages,
    isLoading,
    handleStatusUpdate,
    deleteFeedback,
    approveFeedback,
    unapproveFeedback,
    handleDragEnd
  } = useFeedbacks();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedbacks</h1>
          <p className="text-muted-foreground">
            Gérez les retours des utilisateurs
          </p>
        </div>

        <Card>
          <FeedbackHeader
            view={view}
            onViewChange={setView}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <CardContent>
            <FeedbackContent
              view={view}
              feedbacks={filteredFeedbacks}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onViewDetails={setSelectedFeedback}
              onStatusUpdate={handleStatusUpdate}
              onDelete={deleteFeedback}
              onApprove={approveFeedback}
              onUnapprove={unapproveFeedback}
              onDragEnd={handleDragEnd}
            />
          </CardContent>
        </Card>

        <FeedbackDetailsDialog
          feedback={selectedFeedback}
          onOpenChange={() => setSelectedFeedback(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbacks;
