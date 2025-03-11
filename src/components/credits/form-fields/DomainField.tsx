
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";
import { LogoPreview } from "@/components/savings/LogoPreview";
import { useLogoPreview } from "@/components/savings/hooks/useLogoPreview";

interface DomainFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DomainField = ({ form }: DomainFieldProps) => {
  const domain = form.watch("nom_domaine") || "";
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useLogoPreview(domain);

  return (
    <FormField
      control={form.control}
      name="nom_domaine"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Domaine de l'organisme (optionnel)</FormLabel>
          <div className="flex items-center gap-4">
            <FormControl>
              <Input
                {...field}
                placeholder="Ex: paypal.com, fortuneo.fr..."
              />
            </FormControl>
            <LogoPreview
              url={previewLogoUrl}
              isValid={isLogoValid}
              isChecking={isCheckingLogo}
              domain={domain}
              className="object-contain"
            />
          </div>
          <FormDescription>
            Le logo sera automatiquement récupéré à partir du domaine
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
