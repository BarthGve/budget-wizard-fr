
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

interface SavingsListProps {
  monthlySavings: MonthlySaving[];
  onSavingDeleted: () => void;
}

export const SavingsList = ({ monthlySavings, onSavingDeleted }: SavingsListProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const deleteMonthlySaving = async (id: string) => {
    const { error } = await supabase.from("monthly_savings").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le versement mensuel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Versement mensuel supprimé",
    });

    onSavingDeleted();
  };

  // Calcul pour la pagination
  const totalPages = Math.ceil(monthlySavings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSavings = monthlySavings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Liste de vos versements mensuels d'épargne</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSavings.map((saving) => (
            <TableRow key={saving.id}>
              <TableCell className="font-medium">{saving.name}</TableCell>
              <TableCell>{saving.description || "-"}</TableCell>
              <TableCell className="text-right">{saving.amount}€</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMonthlySaving(saving.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={cn(
                  "cursor-pointer",
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={cn(
                  "cursor-pointer",
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
