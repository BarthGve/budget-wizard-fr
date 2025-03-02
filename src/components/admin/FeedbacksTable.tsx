
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Feedback } from "@/types/feedback";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackTableRow } from "./feedback-table/FeedbackTableRow";
import { DeleteFeedbackDialog } from "./feedback-table/DeleteFeedbackDialog";

interface FeedbacksTableProps {
  feedbacks: Feedback[];
  onViewDetails: (feedback: Feedback) => void;
  onStatusUpdate: (updatedFeedback: Feedback) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onUnapprove: (id: string) => void;
}

export const FeedbacksTable = ({ 
  feedbacks, 
  onViewDetails, 
  onStatusUpdate, 
  onDelete,
  onApprove,
  onUnapprove
}: FeedbacksTableProps) => {
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  
  const handleRowClick = async (feedback: Feedback) => {
    if (feedback.status === "pending") {
      try {
        const { error } = await supabase
          .from("feedbacks")
          .update({ status: "read" })
          .eq("id", feedback.id);

        if (error) throw error;

        const updatedFeedback = {
          ...feedback,
          status: "read" as const
        };
        onStatusUpdate(updatedFeedback);
        onViewDetails(updatedFeedback);
      } catch (error) {
        console.error("Error updating status:", error);
      }
    } else {
      onViewDetails(feedback);
    }
  };

  const handleConfirmDelete = () => {
    if (feedbackToDelete) {
      onDelete(feedbackToDelete);
      setFeedbackToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Note & Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <FeedbackTableRow
              key={feedback.id}
              feedback={feedback}
              onRowClick={() => handleRowClick(feedback)}
              onApprove={onApprove}
              onUnapprove={onUnapprove}
              onDeleteClick={setFeedbackToDelete}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteFeedbackDialog
        feedbackId={feedbackToDelete}
        onOpenChange={(open) => !open && setFeedbackToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};
