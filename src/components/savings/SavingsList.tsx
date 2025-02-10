
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

  return (
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
        {monthlySavings.map((saving) => (
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
  );
};
