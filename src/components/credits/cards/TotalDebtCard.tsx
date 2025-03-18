
import { CreditCard } from "lucide-react";
import { CreditCard as CardComponent } from "./CreditCard";
import { formatCurrency } from "@/utils/format";

interface TotalDebtCardProps {
  totalDebt: number;
  activeCreditsCount: number;
}

export const TotalDebtCard = ({
  totalDebt,
  activeCreditsCount
}: TotalDebtCardProps) => {
  return (
    <CardComponent
      icon={<CreditCard className="h-4 w-4" />}
      title="Endettement total"
      description={`${activeCreditsCount} crédit(s) en cours`}
      amount={totalDebt}
      subtitle="Montant total restant dû"
      badgeText="cumul"
      colorScheme="blue"
    />
  );
};
