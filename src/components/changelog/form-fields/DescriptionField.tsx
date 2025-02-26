
import React from 'react';
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
import ReactMarkdown from "react-markdown";

interface DescriptionFieldProps {
  form: UseFormReturn<FormData>;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
  const description = form.watch("description");

  // Convertit les retours à la ligne simples en doubles pour le rendu Markdown
  const formattedDescription = description?.replace(/\n/g, '\n\n');

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <div className="space-y-4">
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
            {description && (
              <div className="p-4 border rounded-md bg-muted/50 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{formattedDescription}</ReactMarkdown>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
