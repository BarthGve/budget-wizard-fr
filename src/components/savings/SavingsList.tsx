
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [selectedSaving, setSelectedSaving] = useState<MonthlySaving | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSaving, setEditedSaving] = useState<MonthlySaving | null>(null);
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

    setIsModalOpen(false);
    onSavingDeleted();
  };

  const updateMonthlySaving = async (saving: MonthlySaving) => {
    const { error } = await supabase
      .from("monthly_savings")
      .update({
        name: saving.name,
        amount: saving.amount,
        description: saving.description,
      })
      .eq("id", saving.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le versement mensuel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Versement mensuel modifié",
    });

    setIsModalOpen(false);
    setIsEditing(false);
    onSavingDeleted();
  };

  const handleRowClick = (saving: MonthlySaving) => {
    setSelectedSaving(saving);
    setEditedSaving(saving);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(monthlySavings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSavings = monthlySavings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versements Mensuels d'Épargne</CardTitle>
        <CardDescription>Gérez vos versements d'épargne automatiques</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSavings.map((saving) => (
                <TableRow 
                  key={saving.id}
                  onClick={() => handleRowClick(saving)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell className="font-medium">{saving.name}</TableCell>
                  <TableCell>{saving.description || "-"}</TableCell>
                  <TableCell className="text-right">{saving.amount}€</TableCell>
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier le versement" : "Gérer le versement"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifiez les informations du versement mensuel"
                  : "Que souhaitez-vous faire avec ce versement mensuel ?"}
              </DialogDescription>
            </DialogHeader>

            {isEditing && editedSaving ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={editedSaving.name}
                    onChange={(e) =>
                      setEditedSaving({ ...editedSaving, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editedSaving.amount}
                    onChange={(e) =>
                      setEditedSaving({
                        ...editedSaving,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editedSaving.description || ""}
                    onChange={(e) =>
                      setEditedSaving({
                        ...editedSaving,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedSaving && deleteMonthlySaving(selectedSaving.id)}
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            )}

            <DialogFooter>
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => editedSaving && updateMonthlySaving(editedSaving)}
                  >
                    Sauvegarder
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Fermer
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
