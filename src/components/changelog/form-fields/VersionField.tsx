
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";

interface VersionFieldProps {
  form: UseFormReturn<FormData>;
}

export function VersionField({ form }: VersionFieldProps) {
  return (
    <FormField
      control={form.control}
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
