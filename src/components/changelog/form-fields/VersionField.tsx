
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormData } from "../types";

export interface VersionFieldProps {
  control: Control<FormData>;
}

export function VersionField({ control }: VersionFieldProps) {
  return (
    <FormField
      control={control}
      name="version"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Version</FormLabel>
          <FormControl>
            <Input {...field} placeholder="1.0.0" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
