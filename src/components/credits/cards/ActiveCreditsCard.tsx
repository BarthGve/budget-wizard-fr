
import { CreditCard as CreditCardIcon } from "lucide-react";
import { CreditCard } from "./CreditCard";

interface ActiveCreditsCardProps {
  activeCredits: any[];
  totalActiveMensualites: number;
}

export const ActiveCreditsCard = ({
  activeCredits,
  totalActiveMensualites
}: ActiveCreditsCardProps) => {
  return (
    <CreditCard
      icon={<CreditCardIcon className="h-4 w-4" />}
      title="Crédits actifs"
      description={`${activeCredits.length} crédit(s) en cours`}
      amount={totalActiveMensualites}
      subtitle="Mensualités totales"
      badgeText="mensuels"
      colorScheme="primary"
    />
  );
};
