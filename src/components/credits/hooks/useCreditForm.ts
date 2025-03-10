
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Credit } from "../types";
import { addMonths, format, isFuture, addDays } from "date-fns";

export const formSchema = z.object({
  nom_credit: z.string().min(1, "Le nom est requis"),
  nom_domaine: z.string().min(1, "Le domaine est requis"),
  montant_mensualite: z.string().min(1, "Le montant est requis").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Le montant doit être un nombre positif"),
  date_premiere_mensualite: z.string().min(1, "La date de première mensualité est requise"),
  months_count: z.union([
    z.number().min(1, "Le nombre de mensualités doit être au moins 1"),
    z.string().min(1, "Le nombre de mensualités est requis").refine(val => !isNaN(Number(val)) && Number(val) > 0, "Le nombre de mensualités doit être un nombre positif")
  ]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseCreditFormProps {
  credit?: Credit;
  onSuccess: () => void;
}

const getFaviconUrl = (domain: string) => {
  if (!domain) return "/placeholder.svg";
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

export const useCreditForm = ({ credit, onSuccess }: UseCreditFormProps) => {
  const queryClient = useQueryClient();

  // Calculer le nombre de mensualités si un crédit existant est passé
  let initialMonthsCount = 0; // Change from string to number
  if (credit) {
    const startDate = new Date(credit.date_premiere_mensualite);
    const endDate = new Date(credit.date_derniere_mensualite);
    
    // Calculer le nombre de mois entre la première et la dernière mensualité
    let count = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      count++;
      currentDate = addMonths(currentDate, 1);
    }
    
    initialMonthsCount = count; // Set as number instead of string
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom_credit: credit?.nom_credit || "",
      nom_domaine: credit?.nom_domaine || "",
      montant_mensualite: credit?.montant_mensualite?.toString() || "",
      date_premiere_mensualite: credit?.date_premiere_mensualite || "",
      months_count: initialMonthsCount || 0, // Use number instead of string
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

      // Calculer la date de dernière mensualité
      const firstPaymentDate = new Date(values.date_premiere_mensualite);
      // Soustraction de 1 car la première mensualité est déjà comptée
      let lastPaymentDate = addMonths(firstPaymentDate, Number(values.months_count) - 1);
      
      // Vérifier si la date de dernière mensualité est dans le futur
      const today = new Date();
      if (!isFuture(lastPaymentDate)) {
        // Si non, ajuster la date pour qu'elle soit au moins égale à demain
        lastPaymentDate = addDays(today, 1);
        console.log("Date de dernière mensualité ajustée au futur:", lastPaymentDate);
      }
      
      const formattedLastPaymentDate = format(lastPaymentDate, "yyyy-MM-dd");

      // Générer l'URL du logo à partir du domaine
      const logo_url = getFaviconUrl(values.nom_domaine);

      const creditData = {
        nom_credit: values.nom_credit.trim(),
        nom_domaine: values.nom_domaine.trim(),
        montant_mensualite: Number(values.montant_mensualite),
        date_premiere_mensualite: values.date_premiere_mensualite,
        date_derniere_mensualite: formattedLastPaymentDate,
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

      // Invalidation simple sans options avancées
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["credits-monthly-stats"] });
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
