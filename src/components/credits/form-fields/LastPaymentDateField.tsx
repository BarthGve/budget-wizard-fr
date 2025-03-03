
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { format, parse, isValid } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";
import { Input } from "@/components/ui/input";

interface LastPaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
}

export const LastPaymentDateField = ({ form }: LastPaymentDateFieldProps) => {
  const [dateInput, setDateInput] = useState("");
  
  // Définir la date minimale comme aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    <FormField
      control={form.control}
      name="date_derniere_mensualite"
      render={({ field }) => {
        // Initialiser l'entrée manuelle avec la valeur actuelle si elle existe
        const formattedValue = field.value 
          ? format(new Date(field.value), "dd/MM/yyyy") 
          : "";
        
        // Permet de définir l'entrée au premier rendu
        if (field.value && dateInput === "") {
          setDateInput(formattedValue);
        }
        
        const handleManualInput = (input: string) => {
          setDateInput(input);
          
          // Essayer de parser la date entrée (format français: JJ/MM/AAAA)
          if (input.length === 10) { // Longueur exacte d'une date au format JJ/MM/AAAA
            const parsedDate = parse(input, "dd/MM/yyyy", new Date());
            
            if (isValid(parsedDate)) {
              // Vérifier que la date est dans le futur
              if (parsedDate > today) {
                field.onChange(format(parsedDate, "yyyy-MM-dd"));
              }
              return;
            }
          }
        };
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Date de dernière mensualité</FormLabel>
            <FormControl>
              <Input
                placeholder="JJ/MM/AAAA"
                value={dateInput}
                onChange={(e) => handleManualInput(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
