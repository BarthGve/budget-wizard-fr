
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChangelogHeaderProps {
  isAdmin: boolean;
  onCreateNew: () => void;
}

export const ChangelogHeader = ({ isAdmin, onCreateNew }: ChangelogHeaderProps) => {
  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-10 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-white/5" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Historique des mises à jour
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-2 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Découvrez les dernières fonctionnalités, améliorations et corrections apportées à notre application. 
              Nous travaillons constamment pour améliorer votre expérience.
            </motion.p>
          </div>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Button 
                onClick={onCreateNew}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover transition-colors"
                size="lg"
              >
                <PlusCircle className="w-5 h-5" />
                Nouvelle entrée
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
