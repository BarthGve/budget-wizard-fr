
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Credit } from "./types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";

interface SettleCreditDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreditSettled: () => void;
}

export const SettleCreditDialog = ({
  credit,
  open,
  onOpenChange,
  onCreditSettled,
}: SettleCreditDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settleDate, setSettleDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Fonction pour solder le crédit
  const handleSettleCredit = async () => {
    setIsLoading(true);
    try {
      // Mettre à jour le statut du crédit en "remboursé"
      const { error } = await supabase
        .from("credits")
        .update({
          statut: "remboursé",
          date_derniere_mensualite: settleDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        })
        .eq("id", credit.id);

      if (error) throw error;

      // Notification de succès
      toast.success(`Le crédit ${credit.nom_credit} a été soldé avec succès`);
      
      // Fermer la boîte de dialogue et rafraîchir la liste
      onOpenChange(false);
      onCreditSettled();
    } catch (error) {
      console.error("Erreur lors du solde du crédit:", error);
      toast.error("Une erreur est survenue lors du solde du crédit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solder le crédit</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de marquer le crédit "{credit.nom_credit}" comme remboursé.
            Cette action déplacera le crédit dans la section des archives.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Date de solde</p>
            <p className="text-sm text-muted-foreground">
              Par défaut, la date d'aujourd'hui sera utilisée comme date de solde.
              Vous pouvez la modifier si nécessaire.
            </p>
            
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !settleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settleDate ? (
                    format(settleDate, "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={settleDate}
                  onSelect={(date) => {
                    setSettleDate(date || new Date());
                    setDatePickerOpen(false);
                  }}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <LoadingButton 
            onClick={handleSettleCredit}
            loading={isLoading}
          >
            Solder le crédit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
