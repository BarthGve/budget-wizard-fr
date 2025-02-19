
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Retailer, RetailerFormData } from "./types";
import { useRetailerForm } from "./useRetailerForm";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  domain: z.string().min(1, "Le domaine est requis")
});

interface RetailerFormProps {
  retailer?: Retailer;
  onSuccess: () => void;
}

export function RetailerForm({ retailer, onSuccess }: RetailerFormProps) {
  const form = useForm<RetailerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: retailer?.name || "",
      domain: "",
    }
  });

  const { onSubmit, isLoading } = useRetailerForm({
    retailer,
    onSuccess
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'enseigne</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Carrefour" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domaine</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: carrefour.fr" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {retailer ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
