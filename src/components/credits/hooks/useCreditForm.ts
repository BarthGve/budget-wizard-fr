
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const formSchema = z.object({
  nom_credit: z.string().min(1, "Le nom est requis"),
  nom_domaine: z.string().min(1, "Le domaine est requis"),
  montant_mensualite: z.string().min(1, "Le montant est requis").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Le montant doit être un nombre positif"),
  date_derniere_mensualite: z.string().min(1, "La date de dernière mensualité est requise")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }, "La date de dernière mensualité doit être dans le futur"),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseCreditFormProps {
  credit?: {
    id: string;
    nom_credit: string;
    nom_domaine: string;
    montant_mensualite: number;
    date_derniere_mensualite: string;
    statut: "actif" | "remboursé";
    logo_url?: string;
  };
  onSuccess: () => void;
}

const getFaviconUrl = (domain: string) => {
  if (!domain) return "/placeholder.svg";
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

export const useCreditForm = ({ credit, onSuccess }: UseCreditFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom_credit: credit?.nom_credit || "",
      nom_domaine: credit?.nom_domaine || "",
      montant_mensualite: credit?.montant_mensualite?.toString() || "",
      date_derniere_mensualite: credit?.date_derniere_mensualite || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      // Générer l'URL du logo à partir du domaine
      const logo_url = getFaviconUrl(values.nom_domaine);

      const creditData = {
        nom_credit: values.nom_credit,
        nom_domaine: values.nom_domaine,
        montant_mensualite: Number(values.montant_mensualite),
        date_derniere_mensualite: values.date_derniere_mensualite,
        logo_url,
        profile_id: user.id,
      };

      if (credit) {
        const { error } = await supabase
          .from("credits")
          .update(creditData)
          .eq("id", credit.id);

        if (error) throw error;
        toast.success("Crédit mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from("credits")
          .insert(creditData);

        if (error) throw error;
        toast.success("Crédit ajouté avec succès");
      }

      // Invalidation ciblée avec exact: true
      queryClient.invalidateQueries({ queryKey: ["credits"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["credits-monthly-stats"], exact: true });
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving credit:", error);
      toast.error(
        credit
          ? "Erreur lors de la mise à jour du crédit"
          : "Erreur lors de l'ajout du crédit"
      );
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
