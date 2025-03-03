
import { format, differenceInMonths, isAfter, isSameDay, addMonths, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/format";

interface CreditProgressBarProps {
  dateDebut: string;
  dateFin: string;
  montantMensuel: number;
}

export const CreditProgressBar = ({ dateDebut, dateFin, montantMensuel }: CreditProgressBarProps) => {
  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);
  const currentDate = new Date();

  // Calculer le nombre total de mois entre le début et la fin
  // On utilise differenceInMonths pour tenir compte des différences exactes entre les dates
  const totalMonths = differenceInMonths(endDate, startDate) + 1; // +1 car on compte la mensualité du jour de début
  
  // Calcul du nombre exact de mensualités payées
  let completedMonths = 0;
  
  // Vérifier si on est avant la première échéance
  if (isBefore(currentDate, startDate)) {
    completedMonths = 0;
  } else {
    // Compter chaque mensualité une par une
    let paymentDate = new Date(startDate);
    
    while (isBefore(paymentDate, currentDate) || isSameDay(paymentDate, currentDate)) {
      completedMonths++;
      
      // Si on atteint la date de fin, on s'arrête
      if (isSameDay(paymentDate, endDate)) {
        break;
      }
      
      // Passer à la prochaine mensualité
      paymentDate = addMonths(paymentDate, 1);
    }
  }
  
  // Limiter le nombre de mensualités au total des mensualités
  completedMonths = Math.min(completedMonths, totalMonths);
  
  // Calculer le pourcentage de progression basé sur les mensualités payées
  const progressPercentage = Math.min(100, Math.max(0, (completedMonths / totalMonths) * 100));

  // Calculer le montant total et le montant déjà remboursé
  const montantTotal = totalMonths * montantMensuel;
  const montantRembourse = completedMonths * montantMensuel;
  const montantRestant = montantTotal - montantRembourse;

  return (
    <TooltipProvider>
      <div className="space-y-2">
       
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Progress value={progressPercentage} className="h-3" />
          </TooltipTrigger>
          <TooltipContent className="space-y-2">
            <p>Mensualités payées : {completedMonths} sur {totalMonths}</p>
            <p>Progression : {progressPercentage.toFixed(1)}%</p>
            <p>Montant remboursé : {formatCurrency(montantRembourse)}</p>
            <p>Montant restant : {formatCurrency(montantRestant)}</p>
            <p>Montant total : {formatCurrency(montantTotal)}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
