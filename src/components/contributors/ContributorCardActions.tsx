
import { Pencil, Trash2 } from "lucide-react";
import { CardActions } from "@/components/ui/card-actions";

interface ContributorCardActionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContributorCardActions = ({
  isOwner,
  onEdit,
  onDelete,
}: ContributorCardActionsProps) => {
  const editOption = {
    label: "Modifier",
    icon: <Pencil className="mr-2 h-4 w-4" />,
    onClick: () => onEdit()
  };

  const deleteOption = {
    label: "Supprimer",
    icon: <Trash2 className="mr-2 h-4 w-4" />,
    onClick: () => onDelete(),
    className: "text-destructive"
  };

  // Only include the delete option if not owner
  const options = isOwner ? [editOption] : [editOption, deleteOption];

  return (
    <CardActions 
      options={options}
      buttonVariant="outline"
      buttonSize="icon"
      align="end"
      width="w-[200px]"
    />
  );
};
