
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { FormData } from "../types";

export interface TypeFieldProps {
  control: Control<FormData>;
}

export function TypeField({ control }: TypeFieldProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="improvement">Amélioration</SelectItem>
              <SelectItem value="bugfix">Correction</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
