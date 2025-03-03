
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";
import { Input } from "@/components/ui/input";

interface LastPaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
}

export const LastPaymentDateField = ({ form }: LastPaymentDateFieldProps) => {
  const [dateInput, setDateInput] = useState("");
  const [open, setOpen] = useState(false);
  
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
            <div className="flex gap-2">
              <FormControl>
                <Input
                  placeholder="JJ/MM/AAAA"
                  value={dateInput}
                  onChange={(e) => handleManualInput(e.target.value)}
                />
              </FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        field.onChange(formattedDate);
                        setDateInput(format(date, "dd/MM/yyyy"));
                        setOpen(false);
                      }
                    }}
                    locale={fr}
                    fromDate={today} // Ne permet que les dates futures
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
