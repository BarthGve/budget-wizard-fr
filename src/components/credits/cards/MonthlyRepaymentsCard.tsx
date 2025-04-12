
import { Banknote } from "lucide-react";
import { CreditCard } from "./CreditCard";

interface MonthlyRepaymentsCardProps {
  repaidThisMonth: number;
  totalRepaidMensualitesThisMonth: number;
}

export const MonthlyRepaymentsCard = ({
  repaidThisMonth,
  totalRepaidMensualitesThisMonth
}: MonthlyRepaymentsCardProps) => {
  return (
    <CreditCard
      icon={<Banknote className="h-4 w-4" />}
      title="Remboursements du mois"
      description={`${repaidThisMonth} crédit(s) à échéance`}
      amount={totalRepaidMensualitesThisMonth}
      subtitle="Mensualités échues"
      badgeText="ce mois"
      colorScheme="green"
    />
  );
};
