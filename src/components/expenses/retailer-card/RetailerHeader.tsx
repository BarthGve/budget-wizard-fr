
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
            // Teinte bleue pour le nom de l'enseigne
            "text-blue-700 hover:text-blue-600",
            // Dark mode
            "dark:text-blue-300 dark:hover:text-blue-400"
          )}
        >
          {retailer.name}
        </Link>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full h-8 w-8 p-0",
          // Nouvelles couleurs bleues pour le bouton
          "bg-blue-100 text-blue-700 hover:bg-blue-200",
          // Dark mode
          "dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50"
        )}
        onClick={onAddExpense}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Ajouter une dépense pour {retailer.name}</span>
      </Button>
    </div>
  );
}
