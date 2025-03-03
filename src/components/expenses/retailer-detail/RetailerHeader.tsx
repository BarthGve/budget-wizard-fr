
import { Link } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col space-y-2">
      <Link 
        to="/expenses" 
        className="flex items-center text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Retour aux dépenses</span>
      </Link>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{retailer.name}</h1>
          {retailer.logo_url && (
            <img 
              src={retailer.logo_url} 
              alt={`Logo ${retailer.name}`} 
              className="h-10 w-10 rounded-full object-contain"
            />
          )}
        </div>
        <Button onClick={onAddExpense} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une dépense
        </Button>
      </div>
    </div>
  );
}
