
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { FormData } from "../types";
import ReactMarkdown from "react-markdown";

export interface DescriptionFieldProps {
  control: Control<FormData>;
}

export function DescriptionField({ control }: DescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => {
        const description = field.value || '';
        
        return (
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
- *texte* pour l'italique
- Appuyez sur Entrée deux fois pour un nouveau paragraphe"
                />
              </FormControl>
              {description && (
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {description}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
