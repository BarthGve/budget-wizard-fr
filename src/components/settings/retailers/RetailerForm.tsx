
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
  // Ajout du protocole si non présent pour éviter les erreurs CORS
  if (!cleanDomain.startsWith('http')) {
    return `https://logo.clearbit.com/${cleanDomain}`;
  }
  const url = new URL(cleanDomain);
  return `https://logo.clearbit.com/${url.hostname}`;
};

export const RetailerForm = ({ onSuccess }: RetailerFormProps) => {
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isLogoValid, setIsLogoValid] = useState(true);
  const [isCheckingLogo, setIsCheckingLogo] = useState(false);

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
    let timeoutId: NodeJS.Timeout;

    const checkLogo = async () => {
      if (!domain?.trim()) {
        setPreviewLogoUrl(null);
        setIsLogoValid(true);
        setIsCheckingLogo(false);
        return;
      }

      try {
        setIsCheckingLogo(true);
        const logoUrl = getFaviconUrl(domain);
        
        if (!logoUrl) {
          setPreviewLogoUrl(null);
          setIsLogoValid(false);
          return;
        }

        setPreviewLogoUrl(logoUrl);

        // Créer une promesse pour charger l'image
        const loadImage = () => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = logoUrl;
          });
        };

        await loadImage();
        setIsLogoValid(true);
      } catch (error) {
        console.error("Error loading logo:", error);
        setIsLogoValid(false);
      } finally {
        setIsCheckingLogo(false);
      }
    };

    // Attendre que l'utilisateur arrête de taper
    timeoutId = setTimeout(checkLogo, 500);

    return () => {
      clearTimeout(timeoutId);
    };
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
                <div className="flex-shrink-0 w-10 h-10 border rounded flex items-center justify-center bg-white">
                  {isCheckingLogo ? (
                    <div className="text-xs text-muted-foreground text-center">
                      Chargement...
                    </div>
                  ) : previewLogoUrl && isLogoValid ? (
                    <img
                      src={previewLogoUrl}
                      alt="Logo preview"
                      className="w-8 h-8 rounded-full object-contain"
                    />
                  ) : domain ? (
                    <div className="text-xs text-muted-foreground text-center">
                      Logo non trouvé
                    </div>
                  ) : null}
                </div>
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
