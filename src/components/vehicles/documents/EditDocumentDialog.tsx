
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { VehicleDocument, VehicleDocumentCategory } from "@/types/vehicle-documents";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/loading-button";

// Schéma de validation du formulaire
const editDocumentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
});

type EditDocumentFormValues = z.infer<typeof editDocumentSchema>;

interface EditDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (documentId: string, data: { name: string; description?: string; categoryId?: string }) => void;
  document: VehicleDocument & { vehicle_document_categories?: VehicleDocumentCategory };
  categories: VehicleDocumentCategory[];
  isUpdating: boolean;
}

export const EditDocumentDialog = ({
  isOpen,
  onOpenChange,
  onUpdate,
  document,
  categories,
  isUpdating
}: EditDocumentDialogProps) => {
  const form = useForm<EditDocumentFormValues>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: {
      name: document?.name || "",
      description: document?.description || "",
      categoryId: document?.category_id || "",
    },
  });

  // Réinitialise le formulaire lorsque le document change
  useEffect(() => {
    if (document && isOpen) {
      form.reset({
        name: document.name || "",
        description: document.description || "",
        categoryId: document.category_id || "",
      });
    }
  }, [document, isOpen, form]);

  const handleSubmit = (data: EditDocumentFormValues) => {
    onUpdate(document.id, {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du document</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormDescription>
                    Une description optionnelle pour ce document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <LoadingButton 
                type="submit" 
                loading={isUpdating}
              >
                Enregistrer
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
