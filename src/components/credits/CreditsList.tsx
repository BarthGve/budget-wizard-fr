
import { Credit } from "./types";
import { EmptyCredits } from "./EmptyCredits";
import { CreditCard } from "./CreditCard";
import { NoArchivedCredits } from "./components/NoArchivedCredits";

interface CreditsListProps {
  credits: Credit[];
  onCreditDeleted: () => void;
  isArchived?: boolean;
}

export const CreditsList = ({ credits, onCreditDeleted, isArchived = false }: CreditsListProps) => {
  if (!credits || credits.length === 0) {
    return isArchived ? <NoArchivedCredits /> : <EmptyCredits />;
  }

  // Tri différent selon qu'il s'agit de crédits actifs ou archivés
  const sortedCredits = [...credits].sort((a, b) => {
    if (isArchived) {
      // Pour les crédits archivés, tri par date de dernière mensualité décroissante (les plus récemment terminés en premier)
      return new Date(b.date_derniere_mensualite).getTime() - new Date(a.date_derniere_mensualite).getTime();
    } else {
      // Pour les crédits actifs, garder le tri existant
      return (
        new Date(a.date_derniere_mensualite).getTime() -
        new Date(b.date_derniere_mensualite).getTime()
      );
    }
  });

  return (
    <div className="grid gap-2">
      {sortedCredits.map((credit, index) => (
        <CreditCard 
          key={credit.id} 
          credit={credit} 
          index={index} 
          onCreditDeleted={onCreditDeleted}
          isArchived={isArchived}
        />
      ))}
    </div>
  );
};
