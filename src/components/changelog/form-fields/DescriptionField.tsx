
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";

interface DescriptionFieldProps {
  form: UseFormReturn<FormData>;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              className="min-h-[200px]"
              placeholder="Vous pouvez utiliser du Markdown pour la mise en forme:
- Utilisez des tirets pour les listes
- **texte** pour mettre en gras
- *texte* pour l'italique"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
