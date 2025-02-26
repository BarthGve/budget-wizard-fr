
import React from 'react';
import { marked } from 'marked';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormDescription,
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
  const [preview, setPreview] = React.useState(false);

  const descriptionValue = form.watch("description");
  const renderedMarkdown = React.useMemo(() => {
    return marked(descriptionValue || '');
  }, [descriptionValue]);

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <div className="space-y-2">
            <div className="flex justify-end space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setPreview(false)}
                className={cn(
                  "px-3 py-1 rounded text-sm",
                  !preview ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                Éditer
              </button>
              <button
                type="button"
                onClick={() => setPreview(true)}
                className={cn(
                  "px-3 py-1 rounded text-sm",
                  preview ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                Aperçu
              </button>
            </div>

            {preview ? (
              <div
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
              />
            ) : (
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[200px] font-mono"
                  placeholder="Vous pouvez utiliser du Markdown pour la mise en forme:
- Utilisez des tirets pour les listes
- **texte** pour mettre en gras
- *texte* pour l'italique"
                />
              </FormControl>
            )}

            <FormDescription>
              Utilisez la syntaxe Markdown pour mettre en forme votre texte
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
