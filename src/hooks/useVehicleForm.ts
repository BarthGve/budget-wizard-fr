
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vehicle } from "@/types/vehicle";

// Schéma de validation pour le formulaire
const vehicleSchema = z.object({
  registration_number: z.string().min(1, "Le numéro d'immatriculation est requis"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().optional(),
  acquisition_date: z.string().min(1, "La date d'acquisition est requise"),
  fuel_type: z.string().min(1, "Le type de carburant est requis"),
  status: z.enum(["actif", "inactif", "vendu"]).default("actif"),
  photo_url: z.string().optional()
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

export const useVehicleForm = (defaultValues?: Partial<Vehicle>) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: defaultValues?.registration_number || "",
      brand: defaultValues?.brand || "",
      model: defaultValues?.model || "",
      acquisition_date: defaultValues?.acquisition_date 
        ? new Date(defaultValues.acquisition_date).toISOString().split("T")[0] 
        : new Date().toISOString().split("T")[0],
      fuel_type: defaultValues?.fuel_type || "",
      status: defaultValues?.status || "actif",
      photo_url: defaultValues?.photo_url || ""
    }
  });

  return { form };
};
