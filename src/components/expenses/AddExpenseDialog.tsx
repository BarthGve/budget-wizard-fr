
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddExpenseDialogProps {
  onExpenseAdded: () => void;
}

export function AddExpenseDialog({ onExpenseAdded }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const { retailers } = useRetailers();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      retailerId: "",
      amount: "",
      date: new Date(),
      comment: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une dépense",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .insert({
          retailer_id: values.retailerId,
          amount: Number(values.amount),
          date: format(values.date, "yyyy-MM-dd"),
          comment: values.comment,
          profile_id: session.session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La dépense a été ajoutée",
      });

      setOpen(false);
      form.reset();
      onExpenseAdded();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la dépense",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une dépense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="retailerId"
              rules={{ required: "L'enseigne est requise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enseigne</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une enseigne" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {retailers?.map((retailer) => (
                        <SelectItem key={retailer.id} value={retailer.id}>
                          {retailer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              rules={{ 
                required: "Le montant est requis",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Montant invalide"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              rules={{ required: "La date est requise" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "P", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire (facultatif)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ajouter un commentaire..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Ajouter</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
