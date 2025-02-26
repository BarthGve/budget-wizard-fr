
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, changelogFormSchema } from "../types";
import { toast } from "sonner";
import { createChangelogEntry, updateChangelogEntry } from "@/services/changelog";
import { ChangelogEntry } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseChangelogFormProps {
  initialData?: ChangelogEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useChangelogForm({ initialData, onSuccess, onCancel }: UseChangelogFormProps) {
  const queryClient = useQueryClient();

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

  const { mutate: create } = useMutation({
    mutationFn: createChangelogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changelog"] });
      toast.success("Entrée ajoutée avec succès");
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating changelog entry:", error);
      toast.error("Une erreur est survenue");
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: FormData }) => 
      updateChangelogEntry(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changelog"] });
      toast.success("Entrée mise à jour avec succès");
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating changelog entry:", error);
      toast.error("Une erreur est survenue");
    },
  });

  async function onSubmit(values: FormData) {
    if (initialData?.id) {
      update({ id: initialData.id, values });
    } else {
      create(values);
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onCancel,
  };
}
