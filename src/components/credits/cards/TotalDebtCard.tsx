
import { Wallet } from "lucide-react";
import { CreditCard as CardComponent } from "./CreditCard";
import { formatCurrency } from "@/utils/format";
import { CreditProgressBar } from "../CreditProgressBar";

interface TotalDebtCardProps {
  totalDebt: number;
  activeCreditsCount: number;
  amountPaid?: number; // Montant déjà remboursé
}

export const TotalDebtCard = ({
  totalDebt,
  activeCreditsCount,
  amountPaid = 0 // Valeur par défaut si non fournie
}: TotalDebtCardProps) => {
  // Calculer le pourcentage remboursé
  const progressPercentage = totalDebt > 0 
    ? Math.min(100, Math.max(0, (amountPaid / totalDebt) * 100))
    : 0;

  return (
    <CardComponent
      icon={<Wallet className="h-4 w-4" />}
      title="Endettement total"
      description={`${activeCreditsCount} crédit(s) en cours`}
      amount={totalDebt}
      subtitle="Montant total"
      badgeText="cumul"
      colorScheme="blue"
    >
      {/* Afficher la barre de progression avec tooltip intégré sur la même ligne que le montant */}
      <div className="mt-1 flex items-center gap-2">
        <div className="flex-grow">
          <CreditProgressBar 
            dateDebut={new Date().toISOString()} 
            dateFin={new Date().toISOString()} 
            montantMensuel={0}
            withTooltip={true} // Activer le tooltip
            colorScheme="blue"
            value={progressPercentage}
            amountPaid={amountPaid}
            totalAmount={totalDebt}
          />
        </div>
      </div>
    </CardComponent>
  );
};
