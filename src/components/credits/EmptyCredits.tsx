import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { Plus } from "lucide-react";

export const EmptyCredits = () => {
  return (
    <Card className={cn(
      "text-center p-6 relative overflow-hidden transition-all duration-200",
      "border-dashed border-2 border-gray-200 bg-white/50",
      "dark:border-gray-700 dark:bg-gray-800/20"
    )}>
      {/* Fond radial gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-senary-400 via-violet-300 to-transparent",
        "dark:opacity-10 dark:from-senary-400 dark:via-violet-500 dark:to-transparent"
      )} />
      
      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div className={cn(
          "mb-4 rounded-full p-3",
          "bg-senary-100 text-senary-700",
          "dark:bg-senary-800/40 dark:text-senary-300" 
        )}>
          <CreditCard className="h-6 w-6" />
        </div>
        
        <h3 className={cn(
          "text-lg font-medium mb-2",
          "text-gray-800 dark:text-gray-200"
        )}>
          Aucun crédit trouvé
        </h3>
        
        <p className={cn(
          "text-sm mb-6 max-w-md",
          "text-gray-600 dark:text-gray-400"
        )}>
          Vous n'avez pas encore de crédit enregistré. Ajoutez votre premier crédit pour commencer à suivre vos remboursements.
        </p>
        
        <CreditDialog 
          trigger={
            <Button
              size="sm" 
              className={cn(
                "bg-white hover:bg-senary-50 text-senary-700 border border-senary-200",
                "shadow-sm",
                "dark:bg-senary-900/30 dark:hover:bg-senary-800/40 dark:text-senary-300 dark:border-senary-700/50"
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un crédit
            </Button>
          } 
        />
      </div>
    </Card>
  );
};
