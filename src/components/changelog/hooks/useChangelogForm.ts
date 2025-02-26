
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, changelogFormSchema } from "../types";
import { toast } from "sonner";
import { createChangelogEntry, updateChangelogEntry } from "@/services/changelog";
import { ChangelogEntry } from "../types";

interface UseChangelogFormProps {
  initialData?: ChangelogEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useChangelogForm({ initialData, onSuccess, onCancel }: UseChangelogFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(changelogFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
        }
      : {
          title: "",
          version: "",
          description: "",
          type: "new",
          date: new Date(),
        },
  });

  async function onSubmit(values: FormData) {
    try {
      if (initialData?.id) {
        await updateChangelogEntry(initialData.id, values);
        toast.success("Entrée mise à jour avec succès");
      } else {
        await createChangelogEntry(values);
        toast.success("Entrée ajoutée avec succès");
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting changelog entry:", error);
      toast.error("Une erreur est survenue");
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onCancel,
  };
}
