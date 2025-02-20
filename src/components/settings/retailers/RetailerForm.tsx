
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRetailerForm } from "./useRetailerForm";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  domain: z.string().optional(),
});

type RetailerFormData = z.infer<typeof formSchema>;

interface RetailerFormProps {
  onSuccess: () => void;
}

const getFaviconUrl = (domain: string) => {
  if (!domain) return null;
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

export const RetailerForm = ({ onSuccess }: RetailerFormProps) => {
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isLogoValid, setIsLogoValid] = useState(true);

  const form = useForm<RetailerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  const { onSubmit, isLoading } = useRetailerForm({ onSuccess });
  const domain = form.watch("domain");

  useEffect(() => {
    if (domain) {
      const logoUrl = getFaviconUrl(domain);
      setPreviewLogoUrl(logoUrl);
      
      // Vérifier si l'image est valide
      const img = new Image();
      img.onload = () => setIsLogoValid(true);
      img.onerror = () => setIsLogoValid(false);
      img.src = logoUrl || "";
    } else {
      setPreviewLogoUrl(null);
      setIsLogoValid(true);
    }
  }, [domain]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Carrefour" {...field} />
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
              <FormLabel>Domaine (optionnel)</FormLabel>
              <div className="flex items-center gap-4">
                <FormControl>
                  <Input placeholder="carrefour.fr" {...field} />
                </FormControl>
                {previewLogoUrl && (
                  <div className="flex-shrink-0 w-10 h-10 border rounded flex items-center justify-center bg-white">
                    {isLogoValid ? (
                      <img
                        src={previewLogoUrl}
                        alt="Logo preview"
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground text-center">
                        Logo non trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
};
