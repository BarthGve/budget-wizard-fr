
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ExpenseFormValues } from "@/hooks/useExpenseForm";

interface CommentFieldProps {
  control: Control<ExpenseFormValues>;
}

export const CommentField = ({ control }: CommentFieldProps) => {
  return (
    <FormField
      control={control}
      name="comment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Commentaire</FormLabel>
          <FormControl>
            <Input 
              placeholder="Optionnel" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
