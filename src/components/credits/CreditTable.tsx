
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Eye, Trash } from "lucide-react";

interface Credit {
  id: string;
  nom_credit: string;
  nom_domaine: string;
  logo_url: string;
  montant_mensualite: number;
  date_derniere_mensualite: string;
  statut: 'actif' | 'remboursé';
  created_at: string;
}

interface CreditTableProps {
  credits: Credit[];
  title: string;
  showActions?: boolean;
  onEdit?: (credit: Credit) => void;
  onDelete?: (creditId: string) => void;
  onViewDetails?: (credit: Credit) => void;
}

export function CreditTable({ 
  credits, 
  title, 
  showActions = false,
  onEdit,
  onDelete,
  onViewDetails
}: CreditTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Table className="border-separate border-spacing-y-1">
        <TableHeader>
          <TableRow className="border-0">
            <TableHead className="text-card-foreground dark:text-card-foreground">Crédit</TableHead>
            <TableHead className="text-card-foreground dark:text-card-foreground text-center">Mensualité</TableHead>
            <TableHead className="text-card-foreground dark:text-card-foreground text-center">Dernière échéance</TableHead>
            {showActions && (
              <TableHead className="text-card-foreground dark:text-card-foreground w-[50px]" />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {credits.map((credit) => (
            <TableRow
              key={credit.id}
              className="rounded-lg bg-card dark:bg-card hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors"
            >
              <TableCell className="border-t border-b border-l border-slate-300 rounded-l-lg py-2">
                <div className="flex items-center gap-3">
                  <img
                    src={credit.logo_url}
                    alt={credit.nom_credit}
                    className="w-8 h-8 rounded-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <span className="font-semibold">{credit.nom_credit}</span>
                </div>
              </TableCell>
              <TableCell className="border-t border-b border-slate-200 text-center py-2">
                {credit.montant_mensualite.toLocaleString('fr-FR')} €
              </TableCell>
              <TableCell className="border-t border-b border-r border-slate-200 rounded-r-lg text-center py-2">
                {new Date(credit.date_derniere_mensualite).toLocaleDateString('fr-FR')}
              </TableCell>
              {showActions && (
                <TableCell className="border-t border-b border-r border-slate-200 rounded-r-lg p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-background"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onEdit?.(credit)}
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onViewDetails?.(credit)}
                      >
                        <Eye className="h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(credit.id)}
                      >
                        <Trash className="h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
          {credits.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={showActions ? 4 : 3} 
                className="text-center py-4 text-muted-foreground"
              >
                Aucun crédit
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
