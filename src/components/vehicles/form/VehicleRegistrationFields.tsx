
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "@/hooks/useVehicleForm";
import { BrandLogoPreview } from "../BrandLogoPreview";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";

interface VehicleRegistrationFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

export const VehicleRegistrationFields = ({ form }: VehicleRegistrationFieldsProps) => {
  // Observer la valeur du champ brand pour la prévisualisation du logo
  const brand = form.watch("brand") || "";
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useVehicleBrandLogo(brand);
  
  return (
    <>
      <FormField
        control={form.control}
        name="registration_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro d'immatriculation</FormLabel>
            <FormControl>
              <Input 
                placeholder="AB-123-CD" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque (nom de domaine)</FormLabel>
              <div className="flex items-center gap-4">
                <FormControl>
                  <Input 
                    placeholder="Ex: mercedes.com, peugeot.fr ..." 
                    {...field} 
                  />
                </FormControl>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                  <BrandLogoPreview
                    url={previewLogoUrl}
                    isValid={isLogoValid}
                    isChecking={isCheckingLogo}
                    brand={brand}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Clio, 308..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
