
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { format, parse, isValid } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";
import { Input } from "@/components/ui/input";

interface LastPaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
}

// This component is no longer used in the current implementation
// The date_derniere_mensualite is calculated from date_premiere_mensualite and months_count
// This is kept for potential future use but it needs to be updated if it's going to be used
export const LastPaymentDateField = ({ form }: LastPaymentDateFieldProps) => {
  const [dateInput, setDateInput] = useState("");
  
  // Définir la date minimale comme aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Note: This component would need to be modified to work with the current form schema
  // which doesn't include a direct field for date_derniere_mensualite
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">Date de dernière mensualité</span>
      <span className="text-sm text-muted-foreground">
        Cette date est automatiquement calculée à partir de la date de première mensualité 
        et du nombre de mensualités.
      </span>
    </div>
  );
};
