
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { FileUploadField } from "./FileUploadField";

// Schéma de validation pour le formulaire de document
export const documentFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  category_id: z.string().min(1, "La catégorie est requise"),
  file: z.instanceof(File, { message: "Un fichier est requis" }),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

interface DocumentFormProps {
  vehicleId: string;
  onSubmit: (data: DocumentFormValues) => Promise<void>;
  onCancel: () => void;
  isAdding: boolean;
}

export const DocumentForm = ({ vehicleId, onSubmit, onCancel, isAdding }: DocumentFormProps) => {
  const { categories } = useVehicleDocuments(vehicleId);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
    },
  });
  
  const handleFileSelected = (file: File) => {
    form.setValue("file", file);
    setSelectedFileName(file.name);
    
    // Auto-remplir le nom du document s'il est vide
    if (!form.getValues().name) {
      // Enlever l'extension du fichier pour le nom
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      form.setValue("name", fileName);
    }
  };
  
  const handleFormSubmit = async (data: DocumentFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
      setSelectedFileName(null);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Fichier</FormLabel>
              <FormControl>
                <FileUploadField 
                  onChange={handleFileSelected}
                  selectedFileName={selectedFileName}
                  onClear={() => {
                    form.setValue("file", undefined as any);
                    setSelectedFileName(null);
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription>
                Formats acceptés: PDF, DOC, DOCX, JPG, PNG, TXT
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom du document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea placeholder="Description du document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isAdding}
          >
            {isAdding ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
