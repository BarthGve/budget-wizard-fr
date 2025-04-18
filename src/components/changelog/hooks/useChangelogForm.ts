
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangelogEntry, FormData } from "../types";
import { createChangelogEntry, updateChangelogEntry } from "@/services/changelog";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(["new", "improvement", "bugfix"]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Format de version invalide (ex: 1.0.0)"),
  date: z.date(),
  isVisible: z.boolean().optional(),
});

export function useChangelogForm(initialData: ChangelogEntry | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultValues: FormData = initialData
    ? {
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        version: initialData.version,
        date: new Date(initialData.date),
        isVisible: initialData.is_visible,
      }
    : {
        title: "",
        description: "",
        type: "new",
        version: "1.0.0",
        date: new Date(),
        isVisible: true,
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData) {
        // Mise à jour d'une entrée existante
        const updatedEntry = await updateChangelogEntry(initialData.id, data);
        await queryClient.invalidateQueries({ queryKey: ["changelog"] });
        toast({
          title: "Entrée mise à jour",
          description: "L'entrée a été mise à jour avec succès",
        });
        return updatedEntry;
      } else {
        // Création d'une nouvelle entrée
        const newEntry = await createChangelogEntry(data);
        await queryClient.invalidateQueries({ queryKey: ["changelog"] });
        toast({
          title: "Entrée créée",
          description: "La nouvelle entrée a été créée avec succès",
        });
        return newEntry;
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'entrée. Veuillez réessayer.",
        variant: "destructive",
      });
      return undefined;
    }
  };

  return { ...form, onSubmit };
}
