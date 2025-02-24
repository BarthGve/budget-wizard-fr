
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InvestmentEditFormProps {
  editDate: Date | undefined;
  setEditDate: (date: Date | undefined) => void;
  editAmount: string;
  setEditAmount: (amount: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const InvestmentEditForm = ({
  editDate,
  setEditDate,
  editAmount,
  setEditAmount,
  onSave,
  onCancel
}: InvestmentEditFormProps) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !editDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {editDate ? format(editDate, 'dd MMMM yyyy', { locale: fr }) : "Sélectionner une date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={editDate}
            onSelect={setEditDate}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      <Input
        type="number"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
        className="max-w-[150px]"
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onSave} size="sm">
          Sauvegarder
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Annuler
        </Button>
      </div>
    </div>
  );
};
