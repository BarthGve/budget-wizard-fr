
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FirstPaymentDateFieldProps {
  form: UseFormReturn<any>;
}

export function FirstPaymentDateField({ form }: FirstPaymentDateFieldProps) {
  const [dateInput, setDateInput] = useState("");

  return (
    <FormField
      control={form.control}
      name="firstPaymentDate"
      render={({ field }) => {
        // Initialiser l'entrée manuelle avec la valeur actuelle si elle existe
        const formattedValue = field.value 
          ? format(new Date(field.value), "dd/MM/yyyy", { locale: fr }) 
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
              field.onChange(parsedDate);
              return;
            }
          }
        };
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Date de première mensualité</FormLabel>
            <FormControl>
              <Input
                placeholder="JJ/MM/AAAA"
                value={dateInput}
                onChange={(e) => handleManualInput(e.target.value)}
                className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
