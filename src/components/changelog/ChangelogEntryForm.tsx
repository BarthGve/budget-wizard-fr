
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TitleField } from "./form-fields/TitleField";
import { VersionField } from "./form-fields/VersionField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { TypeField } from "./form-fields/TypeField";
import { DateField } from "./form-fields/DateField";
import { ChangelogEntry } from "./types";
import { useChangelogForm } from "./hooks/useChangelogForm";

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
  const { form, onSubmit, onCancel: handleCancel } = useChangelogForm({
    initialData,
    onSuccess,
    onCancel,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <TitleField form={form} />
        <VersionField form={form} />
        <DescriptionField form={form} />
        <TypeField form={form} />
        <DateField form={form} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
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
