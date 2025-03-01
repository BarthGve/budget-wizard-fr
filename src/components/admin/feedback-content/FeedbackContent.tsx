
import { Feedback } from "@/types/feedback";
import { FeedbacksTable } from "@/components/admin/FeedbacksTable";
import { FeedbacksKanban } from "@/components/admin/FeedbacksKanban";
import { FeedbackPagination } from "@/components/admin/FeedbackPagination";

interface FeedbackContentProps {
  view: "table" | "kanban";
  feedbacks: Feedback[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (feedback: Feedback | null) => void;
  onStatusUpdate: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onUnapprove: (id: string) => void;
  onDragEnd: (result: any) => void;
}

export const FeedbackContent = ({
  view,
  feedbacks,
  page,
  totalPages,
  onPageChange,
  onViewDetails,
  onStatusUpdate,
  onDelete,
  onApprove,
  onUnapprove,
  onDragEnd
}: FeedbackContentProps) => {
  return (
    <div className="space-y-4">
      {view === "table" ? (
        <FeedbacksTable
          feedbacks={feedbacks}
          onViewDetails={onViewDetails}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
          onApprove={onApprove}
          onUnapprove={onUnapprove}
        />
      ) : (
        <FeedbacksKanban
          feedbacks={feedbacks}
          onDragEnd={onDragEnd}
        />
      )}

      <FeedbackPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
