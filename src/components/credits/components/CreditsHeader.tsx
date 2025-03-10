
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreditDialog } from "../CreditDialog";
import { cn } from "@/lib/utils";

export const CreditsHeader = () => {
  return (
    <motion.div 
      className="flex items-center justify-between"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className={cn(
          "text-3xl font-bold tracking-tight",
          // Un dégradé de violets plus chaud et distinctif pour les crédits
          "bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent",
          // Ajustement pour le mode sombre
          "dark:from-purple-400 dark:via-violet-400 dark:to-fuchsia-400"
        )}>
          Crédits
        </h1>
        <p className={cn(
          "text-muted-foreground",
          "dark:text-gray-400"
        )}>
          Gérez vos crédits et leurs échéances
        </p>
      </div>
      <CreditDialog 
        trigger={
          <Button 
            className={cn(
              // Base button style
              "text-white font-medium shadow-sm transition-all duration-200",
              // Gradient background avec couleur violette dominante
              "bg-gradient-to-r from-purple-600 to-violet-500",
              // Effets hover avec dégradé légèrement plus foncé et ombre plus prononcée
              "hover:from-purple-700 hover:to-violet-600 hover:shadow",
              // Animation subtile pour le bouton
              "active:scale-[0.98]",
              // Mode sombre ajustements
              "dark:from-purple-500 dark:to-violet-500 dark:shadow-violet-900/20",
              "dark:hover:from-purple-600 dark:hover:to-violet-600"
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un crédit
          </Button>
        } 
      />
    </motion.div>
  );
};
