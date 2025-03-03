
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Credit } from "./types";
import { format, differenceInMonths, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditInfoDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditInfoDialog({ credit, open, onOpenChange }: CreditInfoDialogProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingMonths, setRemainingMonths] = useState(0);
  const [paidMonths, setPaidMonths] = useState(0);
  const [totalMonths, setTotalMonths] = useState(0);

  useEffect(() => {
    if (credit) {
      const startDate = new Date(credit.date_premiere_mensualite);
      const endDate = new Date(credit.date_derniere_mensualite);
      const today = new Date();
      
      // Calculer le nombre total de mois
      const totalMonthsCount = differenceInMonths(endDate, startDate) + 1;
      setTotalMonths(totalMonthsCount);
      
      // Calculer le nombre de mois déjà payés
      let paidMonthsCount = 0;
      if (today > startDate) {
        paidMonthsCount = Math.min(differenceInMonths(today, startDate) + 1, totalMonthsCount);
      }
      setPaidMonths(paidMonthsCount);
      
      // Calculer le nombre de mois restants
      const remainingMonthsCount = Math.max(0, totalMonthsCount - paidMonthsCount);
      setRemainingMonths(remainingMonthsCount);
      
      // Calculer les montants
      const totalAmountValue = credit.montant_mensualite * totalMonthsCount;
      setTotalAmount(totalAmountValue);
      
      const paidAmountValue = credit.montant_mensualite * paidMonthsCount;
      setPaidAmount(paidAmountValue);
      
      const remainingAmountValue = credit.montant_mensualite * remainingMonthsCount;
      setRemainingAmount(remainingAmountValue);
      
      // Calculer le pourcentage de progression
      const percentage = (paidMonthsCount / totalMonthsCount) * 100;
      setProgressPercentage(percentage);
    }
  }, [credit]);

  // Formater la date en mois/année
  const formatMonthYear = (dateString: string) => {
    return format(new Date(dateString), 'MMM yyyy', { locale: fr });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {credit.logo_url && (
              <img
                src={credit.logo_url}
                alt={credit.nom_credit}
                className="w-6 h-6 rounded-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            )}
            Informations sur {credit.nom_credit}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nom du crédit</p>
              <p className="font-medium">{credit.nom_credit}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Domaine</p>
              <p className="font-medium">{credit.nom_domaine}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mensualité</p>
              <p className="font-medium">{credit.montant_mensualite.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-medium">{credit.statut}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Première échéance</p>
              <p className="font-medium">{format(new Date(credit.date_premiere_mensualite), 'dd MMMM yyyy', { locale: fr })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dernière échéance</p>
              <p className="font-medium">{format(new Date(credit.date_derniere_mensualite), 'dd MMMM yyyy', { locale: fr })}</p>
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <div className="flex justify-between text-sm">
              <span>{formatMonthYear(credit.date_premiere_mensualite)}</span>
              <span>{formatMonthYear(credit.date_derniere_mensualite)}</span>
            </div>
            
            <TooltipProvider>
              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-4 relative">
                      <Progress value={progressPercentage} className="h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="max-w-xs">
                    <div className="text-center">
                      <p className="font-medium">Avancement du crédit: {Math.round(progressPercentage)}%</p>
                      <p className="text-sm">Durée totale: {totalMonths} mois</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                <div className="flex justify-between mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payé</p>
                        <p className="text-md">{paidAmount.toLocaleString('fr-FR')} €</p>
                        <p className="text-xs text-muted-foreground">{paidMonths} mensualités</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Montant déjà remboursé</p>
                      <p className="text-xs">Période: {formatMonthYear(credit.date_premiere_mensualite)} - {addMonths(new Date(credit.date_premiere_mensualite), paidMonths - 1) > new Date() ? formatMonthYear(new Date().toISOString()) : formatMonthYear(addMonths(new Date(credit.date_premiere_mensualite), paidMonths - 1).toISOString())}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium">Restant</p>
                        <p className="text-md">{remainingAmount.toLocaleString('fr-FR')} €</p>
                        <p className="text-xs text-muted-foreground">{remainingMonths} mensualités</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Montant restant à rembourser</p>
                      <p className="text-xs">Période: {addMonths(new Date(credit.date_premiere_mensualite), paidMonths).toISOString().substring(0, 10) < credit.date_derniere_mensualite ? formatMonthYear(addMonths(new Date(credit.date_premiere_mensualite), paidMonths).toISOString()) : formatMonthYear(credit.date_derniere_mensualite)} - {formatMonthYear(credit.date_derniere_mensualite)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>
            
            <div className="mt-4 p-3 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Montant total du crédit:</p>
                <p className="text-md font-bold">{totalAmount.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
