
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Zap } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
  const [isEarlySettlement, setIsEarlySettlement] = useState(false);
  
  // Vérifier si le règlement est anticipé en comparant avec la date de fin prévue
  const isBeforeEndDate = credit.date_derniere_mensualite && 
    settleDate < new Date(credit.date_derniere_mensualite);
  
  // Fonction pour solder le crédit
  const handleSettleCredit = async () => {
    setIsLoading(true);
    try {
      // Déterminer si le règlement est anticipé (soit manuellement indiqué ou par date)
      const effectiveEarlySettlement = isEarlySettlement || isBeforeEndDate;
      
      // Mettre à jour le statut du crédit en "remboursé"
      const { error } = await supabase
        .from("credits")
        .update({
          statut: "remboursé",
          date_derniere_mensualite: settleDate.toISOString().split("T")[0], // Format YYYY-MM-DD
          is_early_settlement: effectiveEarlySettlement, // Enregistrer l'information d'anticipation
        })
        .eq("id", credit.id);

      if (error) throw error;

      // Notification de succès
      toast.success(`Le crédit ${credit.nom_credit} a été soldé avec succès${effectiveEarlySettlement ? ' par anticipation' : ''}`);
      
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
          
          {/* Section pour détecter si le crédit est soldé par anticipation */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="earlySettlement" 
                checked={isEarlySettlement || isBeforeEndDate}
                onCheckedChange={(checked) => {
                  // Si la date est avant la fin, on ne peut pas décocher la case
                  if (!isBeforeEndDate || checked) {
                    setIsEarlySettlement(checked === true);
                  }
                }}
                disabled={isBeforeEndDate} // Désactiver si la date est déjà anticipée
              />
              <label 
                htmlFor="earlySettlement" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                Solde anticipé
                {isBeforeEndDate && (
                  <Badge 
                    variant="outline" 
                    className="ml-2 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
                  >
                    <Zap className="h-3 w-3 mr-1" /> Détecté
                  </Badge>
                )}
              </label>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              {isBeforeEndDate 
                ? `Date de fin prévue: ${format(new Date(credit.date_derniere_mensualite), "dd MMMM yyyy", { locale: fr })}`
                : "Cochez cette case si vous avez remboursé ce crédit avant son échéance prévue."}
            </p>
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
