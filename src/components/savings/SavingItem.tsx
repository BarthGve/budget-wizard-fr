
import { Button } from "@/components/ui/button";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/format";


interface SavingItemProps {
  saving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
  };
  onEdit: (saving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }) => void;
  onDelete: (saving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
  }) => void;
}

export const SavingItem = ({ saving, onEdit, onDelete }: SavingItemProps) => {
  return (
    <div
      
      className="flex items-center justify-between p-2 border rounded-lg bg-card dark:bg-card mb-2 mt-2"
    >
      <div className="flex items-center gap-4">
        <img
          src={saving.logo_url || "/placeholder.svg"}
          alt={saving.name}
          className="w-10 h-10 rounded-full object-contain"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div>
          <h4 className="font-medium">{saving.name}</h4>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(saving.amount)} / mois
          </p>
          {saving.is_project_saving && (
            <p className="text-xs text-blue-500 italic">
              Lié à un projet d'épargne
            </p>
          )}
        </div>
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {!saving.is_project_saving && (
            <DropdownMenuItem onClick={() => onEdit(saving)}>
              <SquarePen className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-destructive" onClick={() => onDelete(saving)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
