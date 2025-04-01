
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

type DateRangePickerProps = {
  value: { from?: Date; to?: Date };
  onChange: (value: { from?: Date; to?: Date }) => void;
};

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<{ from?: Date; to?: Date }>(value);

  // Formater l'affichage de la plage de dates
  const formatDateRange = () => {
    if (value.from && value.to) {
      return `${format(value.from, 'dd/MM/yyyy', { locale: fr })} - ${format(value.to, 'dd/MM/yyyy', { locale: fr })}`;
    }
    if (value.from) {
      return `À partir du ${format(value.from, 'dd/MM/yyyy', { locale: fr })}`;
    }
    if (value.to) {
      return `Jusqu'au ${format(value.to, 'dd/MM/yyyy', { locale: fr })}`;
    }
    return 'Sélectionner des dates';
  };

  // Appliquer les changements
  const handleApply = () => {
    onChange(internalValue);
    setIsOpen(false);
  };

  // Réinitialiser les dates
  const handleClear = () => {
    const newValue = { from: undefined, to: undefined };
    setInternalValue(newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[240px] justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="range"
            selected={{ 
              from: internalValue.from || undefined, 
              to: internalValue.to || undefined 
            }}
            onSelect={(range: DateRange | undefined) => {
              setInternalValue({ 
                from: range?.from, 
                to: range?.to
              });
            }}
            numberOfMonths={1}
            locale={fr}
            className={cn("rounded-md border", "p-3 pointer-events-auto")}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Réinitialiser
            </Button>
            <Button size="sm" onClick={handleApply}>
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
