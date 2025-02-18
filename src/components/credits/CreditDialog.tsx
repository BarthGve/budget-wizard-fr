
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditForm } from "./CreditForm";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditDialog({ open, onOpenChange }: CreditDialogProps) {
  const queryClient = useQueryClient();

  const handleSubmit = async (values: {
    nom_credit: string;
    nom_domaine: string;
    montant_mensualite: string;
    date_derniere_mensualite: string;
  }) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un crédit");
        return;
      }

      const logo_url = `https://logo.clearbit.com/${values.nom_domaine}`;

      const { error } = await supabase.from("credits").insert({
        profile_id: user.id,
        nom_credit: values.nom_credit,
        nom_domaine: values.nom_domaine,
        logo_url,
        montant_mensualite: Number(values.montant_mensualite),
        date_derniere_mensualite: values.date_derniere_mensualite,
      });

      if (error) throw error;

      // Ajouter aux charges récurrentes
      await supabase.from("recurring_expenses").insert({
        profile_id: user.id,
        name: `Crédit - ${values.nom_credit}`,
        amount: Number(values.montant_mensualite),
        category: "Crédits",
        periodicity: "monthly",
        debit_day: 1,
        logo_url,
      });

      toast.success("Crédit ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding credit:", error);
      toast.error("Erreur lors de l'ajout du crédit");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un crédit</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau crédit. Il sera automatiquement ajouté à vos charges récurrentes.
          </DialogDescription>
        </DialogHeader>
        <CreditForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
