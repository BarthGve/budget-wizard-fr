
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChangelogEntry,
  FormData,
} from "./types";
import { useChangelogForm } from "./hooks/useChangelogForm";
import { TitleField } from "./form-fields/TitleField";
import { TypeField } from "./form-fields/TypeField";
import { VersionField } from "./form-fields/VersionField";
import { DateField } from "./form-fields/DateField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { Switch } from "@/components/ui/switch";
import { EyeOff } from "lucide-react";

interface ChangelogEntryFormProps {
  initialData: ChangelogEntry | null;
  onSuccess: (entry?: ChangelogEntry) => void;
  onCancel: () => void;
}

export const ChangelogEntryForm = ({ 
  initialData, 
  onSuccess, 
  onCancel 
}: ChangelogEntryFormProps) => {
  const { isAdmin } = usePagePermissions();
  const form = useChangelogForm(initialData);
  
  const handleSubmit = async (values: FormData) => {
    try {
      const updatedEntry = await form.onSubmit(values);
      if (updatedEntry) {
        onSuccess(updatedEntry);
      } else {
        // Gérer le cas où l'entrée n'est pas mise à jour correctement
        console.error("Failed to update/create changelog entry");
        onSuccess(); // Retourner undefined pour indiquer un échec
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      // Gérer l'erreur lors de la soumission du formulaire
      onSuccess(); // Retourner undefined pour indiquer un échec
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <TitleField control={form.control} />
          </div>
          
          <TypeField control={form.control} />
          <VersionField control={form.control} />
          
          <div className="col-span-2">
            <DateField control={form.control} />
          </div>
          
          <div className="col-span-2">
            <DescriptionField control={form.control} />
          </div>
          
          {isAdmin && (
            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="visibility-toggle"
                checked={form.watch("isVisible") !== false}
                onCheckedChange={(checked) => form.setValue("isVisible", checked)}
              />
              <div className="grid gap-0.5">
                <label
                  htmlFor="visibility-toggle"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Visible pour les utilisateurs
                </label>
                {form.watch("isVisible") === false && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Cette entrée sera masquée pour les utilisateurs normaux
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
