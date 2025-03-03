
import { format, differenceInMonths, isAfter, isSameDay, isSameMonth } from "date-fns";
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

  // Calculer le nombre total de mensualités entre le début et la fin
  const totalMonths = differenceInMonths(endDate, startDate) + 1; // +1 car on compte la mensualité du jour de début
  
  // Calculer le nombre de mensualités payées
  // Une mensualité est comptée comme payée dès le jour de l'échéance
  let completedMonths = 0;
  
  if (isAfter(currentDate, endDate) || isSameDay(currentDate, endDate)) {
    // Si on est après ou exactement à la date de fin, toutes les mensualités sont payées
    completedMonths = totalMonths;
  } else if (isAfter(currentDate, startDate) || isSameDay(currentDate, startDate)) {
    // On compte le nombre de mois entre la date de début et aujourd'hui
    // +1 car on compte la mensualité du jour de début (si on est au moins à ce jour)
    completedMonths = differenceInMonths(currentDate, startDate) + 1;
  }
  
  // Calculer le pourcentage de progression basé sur les mensualités payées
  const progressPercentage = Math.min(100, Math.max(0, (completedMonths / totalMonths) * 100));

  // Calculer le montant total et le montant déjà remboursé
  const montantTotal = totalMonths * montantMensuel;
  const montantRembourse = completedMonths * montantMensuel;
  const montantRestant = montantTotal - montantRembourse;

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <Tooltip>
            <TooltipTrigger>
              <span>{format(startDate, 'MMM yyyy', { locale: fr })}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Début du crédit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <span>{format(endDate, 'MMM yyyy', { locale: fr })}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fin du crédit</p>
            </TooltipContent>
          </Tooltip>
        </div>
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
