
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecurringExpenseForm } from "./RecurringExpenseForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RecurringExpenseDialogProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
  };
  trigger: React.ReactNode;
}

export function RecurringExpenseDialog({ expense, trigger }: RecurringExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
          </DialogTitle>
        </DialogHeader>
        <RecurringExpenseForm
          expense={expense}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          colorPalette={profile?.color_palette}
        />
      </DialogContent>
    </Dialog>
  );
}
