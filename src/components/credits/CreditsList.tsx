
import { Credit } from "./types";
import { EmptyCredits } from "./EmptyCredits";
import { CreditCard } from "./CreditCard";

interface CreditsListProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const CreditsList = ({ credits, onCreditDeleted }: CreditsListProps) => {
  if (!credits || credits.length === 0) {
    return <EmptyCredits />;
  }

  const sortedCredits = [...credits].sort((a, b) => {
    return (
      new Date(a.date_derniere_mensualite).getTime() -
      new Date(b.date_derniere_mensualite).getTime()
    );
  });

  return (
    <div className="grid gap-2">
      {sortedCredits.map((credit, index) => (
        <CreditCard 
          key={credit.id} 
          credit={credit} 
          index={index} 
          onCreditDeleted={onCreditDeleted} 
        />
      ))}
    </div>
  );
};
