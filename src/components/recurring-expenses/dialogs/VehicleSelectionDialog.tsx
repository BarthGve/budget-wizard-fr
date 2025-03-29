
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Car, CheckCircle2 } from "lucide-react";
import { expenseTypes } from "@/components/vehicles/expenses/form/ExpenseTypeField";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  vehicle_id: z.string({ required_error: "Veuillez sélectionner un véhicule" }),
  vehicle_expense_type: z.string({ required_error: "Veuillez sélectionner un type de dépense" }),
});

interface VehicleSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelected: (data: any) => void;
}

export function VehicleSelectionDialog({
  isOpen,
  onClose,
  onSelected,
}: VehicleSelectionDialogProps) {
  const [step, setStep] = useState<"vehicle" | "expense_type">("vehicle");
  
  // Log pour débogage
  useEffect(() => {
    console.log("VehicleSelectionDialog - État isOpen:", isOpen);
    console.log("VehicleSelectionDialog - Étape actuelle:", step);
  }, [isOpen, step]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_id: "",
      vehicle_expense_type: "",
    },
  });

  // Réinitialiser le formulaire et l'étape lorsque le dialogue s'ouvre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        vehicle_id: "",
        vehicle_expense_type: "",
      });
      setStep("vehicle");
    }
  }, [isOpen, form]);

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["active-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, brand, model, registration_number")
        .eq("status", "actif")
        .order("brand");
      
      if (error) throw error;
      console.log("Véhicules récupérés:", data);
      return data;
    },
    enabled: isOpen,
  });

  // Formater les types de dépenses du format de ExpenseTypeField
  const formattedExpenseTypes = expenseTypes.map(type => ({
    id: type.value,
    name: type.label
  }));

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Formulaire soumis avec valeurs:", values);
    onSelected(values);
  };

  const handleNextStep = () => {
    if (form.getValues("vehicle_id")) {
      console.log("Passage à l'étape suivante (type de dépense)");
      setStep("expense_type");
    } else {
      console.log("Erreur: aucun véhicule sélectionné");
      form.setError("vehicle_id", {
        type: "manual",
        message: "Veuillez sélectionner un véhicule",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md p-0 gap-0 border-0 rounded-lg overflow-hidden",
        "shadow-xl"
      )}>
        <DialogHeader className="p-6 pb-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-blue-100 text-blue-600", 
              "dark:bg-blue-900/30 dark:text-blue-300"
            )}>
              <Car className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">
              {step === "vehicle" ? "Sélectionner un véhicule" : "Type de dépense"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {step === "vehicle" 
              ? "Choisissez un véhicule à associer à cette charge récurrente" 
              : "Sélectionnez le type de dépense pour ce véhicule"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 pt-2">
            {step === "vehicle" && (
              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        console.log("Véhicule sélectionné:", value);
                        field.onChange(value);
                      }}
                      disabled={isLoadingVehicles}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles?.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} ({vehicle.registration_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === "expense_type" && (
              <FormField
                control={form.control}
                name="vehicle_expense_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de dépense véhicule</FormLabel>
                    <Select 
                      value={field.value}
                      onValueChange={(value) => {
                        console.log("Type de dépense sélectionné:", value);
                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type de dépense" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formattedExpenseTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4 px-0 pb-0">
              {step === "vehicle" ? (
                <div className="flex w-full justify-between sm:justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500"
                  >
                    Suivant
                  </Button>
                </div>
              ) : (
                <div className="flex w-full justify-between sm:justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("vehicle")}
                    className="flex-1 sm:flex-initial"
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmer
                  </Button>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
