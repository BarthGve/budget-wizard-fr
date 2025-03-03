
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { addMonths, differenceInMonths, parseISO, format, parse, isValid } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface StepFourProps {
  data: Partial<SavingsProject>;
  mode: SavingsMode;
  onChange: (data: Partial<SavingsProject>) => void;
}

export const StepFour = ({ data, mode, onChange }: StepFourProps) => {
  const minDate = addMonths(new Date(), 1); // Date minimum = +1 mois
  const formattedMinDate = minDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

  const [date, setDate] = useState<string>(
    data.date_estimee ? new Date(data.date_estimee).toISOString().split("T")[0] : formattedMinDate
  );
  
  const [dateInput, setDateInput] = useState(
    data.date_estimee ? format(new Date(data.date_estimee), "dd/MM/yyyy") : format(minDate, "dd/MM/yyyy")
  );
  
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { toast } = useToast();

  const handleDateChange = (newDate: string) => {
    if (newDate) {
      const dateObj = parseISO(newDate);

      // Vérifie si la date est inférieure à +1 mois
      if (dateObj < minDate) {
        toast({
          title: "Date invalide",
          description: "La date cible doit être au moins 1 mois après aujourd'hui",
          variant: "destructive"
        });
        return;
      }

      setDate(newDate);
      const months = differenceInMonths(dateObj, new Date());
      const monthlyAmount = data.montant_total ? data.montant_total / months : 0;

      onChange({
        ...data,
        date_estimee: dateObj.toISOString(),
        montant_mensuel: Math.ceil(monthlyAmount)
      });
    }
  };
  
  const handleDateInputChange = (input: string) => {
    setDateInput(input);
    
    // Essayer de parser la date entrée (format français: JJ/MM/AAAA)
    if (input.length === 10) { // Longueur exacte d'une date au format JJ/MM/AAAA
      const parsedDate = parse(input, "dd/MM/yyyy", new Date());
      
      if (isValid(parsedDate)) {
        // Vérifier que la date est au moins 1 mois dans le futur
        if (parsedDate >= minDate) {
          const newDate = format(parsedDate, "yyyy-MM-dd");
          setDate(newDate);
          handleDateChange(newDate);
        } else {
          toast({
            title: "Date invalide",
            description: "La date cible doit être au moins 1 mois après aujourd'hui",
            variant: "destructive"
          });
        }
      }
    }
  };

  const handleMonthlyAmountChange = (amount: string) => {
    const monthlyAmount = parseFloat(amount);
    
    if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
      return;
    }

    // Calcul de la date estimée d'atteinte de l'objectif
    if (data.montant_total && monthlyAmount > 0) {
      const months = Math.ceil(data.montant_total / monthlyAmount);
      const estimatedDate = addMonths(new Date(), months);
      const formattedDate = estimatedDate.toISOString().split("T")[0];
      
      setDate(formattedDate);
      setDateInput(format(estimatedDate, "dd/MM/yyyy"));
      
      onChange({
        ...data,
        montant_mensuel: monthlyAmount,
        date_estimee: estimatedDate.toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      {mode === "par_date" ? (
        <div className="space-y-2">
          <Label>Date cible *</Label>
          <div className="flex gap-2">
            <Input
              placeholder="JJ/MM/AAAA"
              value={dateInput}
              onChange={(e) => handleDateInputChange(e.target.value)}
              className="flex-1"
            />
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      const formattedDate = format(selectedDate, "yyyy-MM-dd");
                      setDate(formattedDate);
                      setDateInput(format(selectedDate, "dd/MM/yyyy"));
                      handleDateChange(formattedDate);
                      setCalendarOpen(false);
                    }
                  }}
                  locale={fr}
                  fromDate={minDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {data.montant_mensuel && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Montant mensuel estimé :</p>
              <p className="text-2xl font-bold">{Math.round(data.montant_mensuel)} €</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="monthly-amount">Montant mensuel (€) *</Label>
          <Input
            id="monthly-amount"
            type="number"
            value={data.montant_mensuel || ""}
            onChange={(e) => handleMonthlyAmountChange(e.target.value)}
            min="1"
            placeholder="Montant mensuel souhaité"
            required
          />
          {date && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Date estimée d'atteinte de l'objectif :</p>
              <p className="text-2xl font-bold">
                {new Date(date).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
