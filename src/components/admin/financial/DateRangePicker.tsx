
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

export type DateRangePickerProps = {
  value: { start?: Date; end?: Date } | undefined;
  onChange: (value: { start?: Date; end?: Date } | undefined) => void;
};

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<{ start?: Date; end?: Date } | undefined>(value);

  // Formater l'affichage de la plage de dates
  const formatDateRange = () => {
    if (!value) return 'Sélectionner des dates';
    
    if (value.start && value.end) {
      return `${format(value.start, 'dd/MM/yyyy', { locale: fr })} - ${format(value.end, 'dd/MM/yyyy', { locale: fr })}`;
    }
    if (value.start) {
      return `À partir du ${format(value.start, 'dd/MM/yyyy', { locale: fr })}`;
    }
    if (value.end) {
      return `Jusqu'au ${format(value.end, 'dd/MM/yyyy', { locale: fr })}`;
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
    const newValue = { start: undefined, end: undefined };
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
              from: internalValue?.start || undefined, 
              to: internalValue?.end || undefined 
            }}
            onSelect={(range: DateRange | undefined) => {
              setInternalValue({ 
                start: range?.from, 
                end: range?.to
              });
            }}
            numberOfMonths={1}
            locale={fr}
            className="rounded-md border pointer-events-auto"
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
};
