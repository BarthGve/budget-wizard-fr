
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";

interface LastPaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
}

export const LastPaymentDateField = ({ form }: LastPaymentDateFieldProps) => {
  // Définir la date minimale comme aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    <FormField
      control={form.control}
      name="date_derniere_mensualite"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date de dernière mensualité</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionnez une date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                locale={fr}
                fromDate={today} // Ne permet que les dates futures
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
