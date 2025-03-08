
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contribution } from "@/hooks/useContributions";
import { ContributionTableRow } from "./contribution-table/ContributionTableRow";
import { DeleteContributionDialog } from "./contribution-table/DeleteContributionDialog";
import { useState } from "react";

interface ContributionsTableProps {
  contributions: Contribution[];
  onViewDetails: (contribution: Contribution) => void;
  onStatusUpdate: (updatedContribution: Contribution) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "pending" | "in_progress" | "completed") => void;
}

export const ContributionsTable = ({ 
  contributions, 
  onViewDetails, 
  onStatusUpdate,
  onDelete,
  onUpdateStatus
}: ContributionsTableProps) => {
  const [contributionToDelete, setContributionToDelete] = useState<string | null>(null);
  
  const handleRowClick = (contribution: Contribution) => {
    onViewDetails(contribution);
  };

  const handleConfirmDelete = () => {
    if (contributionToDelete) {
      onDelete(contributionToDelete);
      setContributionToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((contribution) => (
            <ContributionTableRow
              key={contribution.id}
              contribution={contribution}
              onRowClick={() => handleRowClick(contribution)}
              onDeleteClick={setContributionToDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteContributionDialog
        contributionId={contributionToDelete}
        onOpenChange={(open) => !open && setContributionToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};
