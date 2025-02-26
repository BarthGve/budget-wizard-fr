
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TitleField } from "./form-fields/TitleField";
import { VersionField } from "./form-fields/VersionField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { TypeField } from "./form-fields/TypeField";
import { DateField } from "./form-fields/DateField";
import { ChangelogEntry, FormData, changelogFormSchema } from "./types";

interface ChangelogEntryFormProps {
  initialData?: ChangelogEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ChangelogEntryForm({
  initialData,
  onSuccess,
  onCancel,
}: ChangelogEntryFormProps) {
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
        const { error } = await supabase
          .from("changelog_entries")
          .update({
            title: values.title,
            version: values.version,
            description: values.description,
            type: values.type,
            date: values.date.toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Entrée mise à jour avec succès");
      } else {
        const { error } = await supabase
          .from("changelog_entries")
          .insert({
            title: values.title,
            version: values.version,
            description: values.description,
            type: values.type,
            date: values.date.toISOString(),
          });

        if (error) throw error;
        toast.success("Entrée ajoutée avec succès");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting changelog entry:", error);
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TitleField form={form} />
        <VersionField form={form} />
        <DescriptionField form={form} />
        <TypeField form={form} />
        <DateField form={form} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
