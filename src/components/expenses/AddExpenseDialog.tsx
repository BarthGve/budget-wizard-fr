
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddExpenseDialogProps {
  onExpenseAdded: () => void;
}

export function AddExpenseDialog({ onExpenseAdded }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [showNoRetailerAlert, setShowNoRetailerAlert] = useState(false);
  const { retailers } = useRetailers();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      retailerId: "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      comment: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Vous devez être connecté pour ajouter une dépense");
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .insert({
          retailer_id: values.retailerId,
          amount: Number(values.amount),
          date: values.date,
          comment: values.comment,
          profile_id: session.session.user.id,
        });

      if (error) throw error;

      toast.success("La dépense a été ajoutée");
      setOpen(false);
      form.reset();
      onExpenseAdded();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Impossible d'ajouter la dépense");
    }
  };

  const handleAddClick = () => {
    if (!retailers?.length) {
      setShowNoRetailerAlert(true);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleAddClick} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle dépense
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
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
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        max={format(new Date(), "yyyy-MM-dd")}
                      />
                    </FormControl>
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

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aucune enseigne disponible</AlertDialogTitle>
            <AlertDialogDescription>
              Vous devez d'abord créer une enseigne avant de pouvoir ajouter une dépense. 
              Souhaitez-vous créer une enseigne maintenant ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, plus tard</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowNoRetailerAlert(false);
                navigate("/settings", { state: { scrollTo: "retailers" } });
              }}
            >
              Oui, créer une enseigne
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
