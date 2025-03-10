
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreditDialog } from "../CreditDialog";
import { cn } from "@/lib/utils";

export const NoActiveCredits = () => {
  return (
    <div className={cn(
      // Design de base pour l'état vide
      "text-center rounded-lg border p-8",
      // Style clair
      "bg-white border-gray-200",
      // Style sombre
      "dark:bg-gray-800/50 dark:border-gray-700"
    )}>
      <h3 className={cn(
        "text-lg font-medium mb-2",
        "text-gray-800 dark:text-gray-200"
      )}>
        Aucun crédit actif
      </h3>
      <p className={cn(
        "text-sm mb-6 max-w-md mx-auto",
        "text-gray-600 dark:text-gray-400"
      )}>
        Vous n'avez pas encore de crédit en cours. Ajoutez votre premier crédit pour commencer à suivre vos remboursements.
      </p>
      <CreditDialog 
        trigger={
          <Button 
            className={cn(
              "text-white font-medium shadow-sm transition-all duration-200",
              "bg-gradient-to-r from-purple-600 to-violet-500",
              "hover:from-purple-700 hover:to-violet-600 hover:shadow",
              "dark:from-purple-500 dark:to-violet-500",
              "dark:hover:from-purple-600 dark:hover:to-violet-600"
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter votre premier crédit
          </Button>
        } 
      />
    </div>
  );
};
