
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditProgressBarProps {
  dateDebut: string;
  dateFin: string;
  montantMensuel: number;
}

export const CreditProgressBar = ({ dateDebut, dateFin, montantMensuel }: CreditProgressBarProps) => {
  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);
  const currentDate = new Date();

  // Calculer le nombre total de jours entre le début et la fin
  const totalDays = differenceInDays(endDate, startDate);
  
  // Calculer le nombre de jours écoulés jusqu'à aujourd'hui
  const elapsedDays = Math.min(
    differenceInDays(currentDate, startDate),
    totalDays
  );

  // Calculer le pourcentage de progression basé sur les jours
  const progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  
  // Calculer le montant total et le montant déjà remboursé
  const montantTotal = (totalDays / 30) * montantMensuel; // Approximation basée sur les jours
  const montantRembourse = (elapsedDays / 30) * montantMensuel; // Approximation basée sur les jours
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
            <p>Progression du remboursement : {progressPercentage.toFixed(1)}%</p>
            <p>Montant remboursé : {montantRembourse.toLocaleString('fr-FR')}€</p>
            <p>Montant restant : {montantRestant.toLocaleString('fr-FR')}€</p>
            <p>Montant total : {montantTotal.toLocaleString('fr-FR')}€</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
