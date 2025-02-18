
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Eye, Trash } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useState } from "react";

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

const ITEMS_PER_PAGE = 10;

export function CreditsList() {
  const [currentPage, setCurrentPage] = useState(0);

  const { data: credits, isLoading } = useQuery({
    queryKey: ["credits", currentPage],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }

      return data as Credit[];
    }
  });

  if (isLoading) return <div>Chargement...</div>;

  const activeCredits = credits?.filter(credit => credit.statut === 'actif') || [];
  const paidCredits = credits?.filter(credit => credit.statut === 'remboursé') || [];

  const totalPages = Math.ceil(activeCredits.length / ITEMS_PER_PAGE);
  const paginatedActiveCredits = activeCredits.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleDeleteCredit = async (creditId: string) => {
    try {
      const { error } = await supabase
        .from("credits")
        .delete()
        .eq("id", creditId);

      if (error) throw error;
      toast.success("Crédit supprimé avec succès");
    } catch (error) {
      console.error("Error deleting credit:", error);
      toast.error("Erreur lors de la suppression du crédit");
    }
  };

  const CreditTable = ({ credits, title, showActions = false }: { 
    credits: Credit[], 
    title: string,
    showActions?: boolean 
  }) => (
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
                        onClick={() => toast.info("Modification du crédit - Fonctionnalité à venir")}
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toast.info("Détails du crédit - Fonctionnalité à venir")}
                      >
                        <Eye className="h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleDeleteCredit(credit.id)}
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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <CreditTable 
          credits={paginatedActiveCredits} 
          title="Crédits actifs" 
          showActions={true} 
        />
        {activeCredits.length > ITEMS_PER_PAGE && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(0, currentPage - 1));
                  }}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index);
                    }}
                    isActive={currentPage === index}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
                  }}
                  className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <CreditTable 
        credits={paidCredits} 
        title="Historique des crédits remboursés" 
      />
    </div>
  );
}
