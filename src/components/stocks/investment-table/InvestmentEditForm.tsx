
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

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
  const [dateString, setDateString] = useState(
    editDate ? format(editDate, "dd/MM/yyyy") : ""
  );

  useEffect(() => {
    if (editDate) {
      setDateString(format(editDate, "dd/MM/yyyy"));
    }
  }, [editDate]);
  
  const handleDateInput = (value: string) => {
    setDateString(value);
    
    // Essayer de parser la date entrée (format français: JJ/MM/AAAA)
    if (value.length === 10) { // Longueur exacte d'une date au format JJ/MM/AAAA
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          setEditDate(parsedDate);
        }
      } catch (error) {
        // Si le format n'est pas valide, on ne met pas à jour la date
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2 flex-1">
        <Input
          type="text"
          value={dateString}
          onChange={(e) => handleDateInput(e.target.value)}
          placeholder="JJ/MM/AAAA"
          className="w-[120px]"
        />
      </div>

      <Input
        type="number"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
        className="max-w-[120px]"
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
