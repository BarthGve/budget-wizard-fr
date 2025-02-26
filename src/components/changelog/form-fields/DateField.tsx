
import React from "react";
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

interface DateFieldProps {
  form: UseFormReturn<FormData>;
}

export function DateField({ form }: DateFieldProps) {
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => {
        // Convert Date object to YYYY-MM-DD format for input
        const value = field.value ? new Date(field.value).toISOString().split('T')[0] : '';

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                className="w-full"
                value={value}
                onChange={(e) => {
                  // Convert string date to Date object when value changes
                  const date = e.target.value ? new Date(e.target.value) : null;
                  field.onChange(date);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
