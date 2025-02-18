
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from "react";

const formSchema = z.object({
  nom_credit: z.string().min(1, "Le nom du crédit est requis"),
  nom_domaine: z.string().min(1, "Le nom de domaine est requis"),
  montant_mensualite: z.string().min(1, "Le montant est requis").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Le montant doit être un nombre positif"
  ),
  date_derniere_mensualite: z.string().min(1, "La date de fin est requise"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreditFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  initialValues?: {
    nom_credit: string;
    nom_domaine: string;
    montant_mensualite: number;
    date_derniere_mensualite: string;
  };
}

export function CreditForm({ onSubmit, onCancel, initialValues }: CreditFormProps) {
  const [previewLogoUrl, setPreviewLogoUrl] = useState(() => 
    initialValues?.nom_domaine 
      ? `https://logo.clearbit.com/${initialValues.nom_domaine}`
      : "/placeholder.svg"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom_credit: initialValues?.nom_credit ?? "",
      nom_domaine: initialValues?.nom_domaine ?? "",
      montant_mensualite: initialValues?.montant_mensualite.toString() ?? "",
      date_derniere_mensualite: initialValues?.date_derniere_mensualite ?? "",
    },
  });

  const handleDomainChange = (domain: string) => {
    if (domain.trim()) {
      const cleanDomain = domain.trim().toLowerCase();
      setPreviewLogoUrl(`https://logo.clearbit.com/${cleanDomain}`);
    } else {
      setPreviewLogoUrl("/placeholder.svg");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom_credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du crédit</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Crédit Immobilier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nom_domaine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de domaine du prêteur</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input 
                    placeholder="Ex: boursorama.com" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleDomainChange(e.target.value);
                    }}
                  />
                  <img
                    src={previewLogoUrl}
                    alt="Logo du prêteur"
                    className="w-8 h-8 rounded-full object-contain"
                    onError={() => setPreviewLogoUrl("/placeholder.svg")}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montant_mensualite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant mensuel (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_derniere_mensualite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de fin</FormLabel>
              <FormControl>
                <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialValues ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
