import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RetailerLogo } from "./RetailerLogo";

interface RetailerHeaderProps {
  retailer: {
    id: string;
    name: string;
    logo_url?: string;
  };
  onAddExpense: () => void;
}

export function RetailerHeader({ retailer, onAddExpense }: RetailerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <RetailerLogo 
          logoUrl={retailer.logo_url} 
          name={retailer.name} 
        />
        
        <Link 
          to={`/expenses/retailer/${retailer.id}`}
          className={cn(
            "text-lg font-medium transition-colors",
            // Utilisation de tertiary pour le nom de l'enseigne
            "text-tertiary hover:text-tertiary", // Remplace le bleu par tertiary
            // Dark mode
            "dark:text-tertiary dark:hover:text-tertiary" // Remplacement pour dark mode
          )}
        >
          {retailer.name}
        </Link>
      </div>
  <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-shrink-0 rounded-full h-7 w-7 p-0 ml-2",
              "bg-tertiary/10 text-tertiary hover:text-tertiary-foreground hover:bg-tertiary/80", // Remplacement par tertiary
              "dark:bg-tertiary/30 dark:text-tertiary dark:hover:text-tertiary-foreground dark:hover:bg-tertiary/50" // Remplacement pour dark mode
            )}
            onClick={() => setAddDialogOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only">Ajouter une dépense pour {retailer.name}</span>
    </div>
  );
}