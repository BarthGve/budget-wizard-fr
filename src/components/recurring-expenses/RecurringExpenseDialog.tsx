import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { RecurringExpenseForm } from "./RecurringExpenseForm";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { BankIcon, EditIcon } from "lucide-react";

interface RecurringExpenseDialogProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
    periodicity: "monthly" | "quarterly" | "yearly";
    debit_day: number;
    debit_month: number | null;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RecurringExpenseDialog({ 
  expense, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: RecurringExpenseDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  // Animation pour le titre et l'icône
  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          "sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl",
          // Light mode
          "bg-white",
          // Dark mode
          "dark:bg-gray-800/95"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(30, 64, 175, 0.1)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)"
        }}
      >
        <div 
          className={cn(
            "relative overflow-hidden",
            // Light mode
            "bg-gradient-to-br from-blue-50 to-white",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-gray-800/90"
          )}
        >
          {/* Cercle décoratif en arrière-plan */}
          <div className={cn(
            "absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20",
            // Light mode
            "bg-gradient-to-br from-blue-400 to-blue-600",
            // Dark mode
            "dark:from-blue-500 dark:to-blue-700 dark:opacity-10"
          )} />
          
          {/* Header avec contenu amélioré */}
          <div className="px-6 pt-6 pb-4 relative z-10">
            <div className="flex items-start gap-4 mb-2">
              <div className={cn(
                "p-2.5 rounded-xl",
                // Light mode
                "bg-blue-100 text-blue-600",
                // Dark mode
                "dark:bg-blue-800/40 dark:text-blue-400"
              )}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={expense ? "edit" : "add"}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                  >
                    {expense ? <EditIcon size={22} /> : <BankIcon size={22} />}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex-1">
                <DialogTitle 
                  className={cn(
                    "text-xl font-bold",
                    // Light mode
                    "text-blue-700",
                    // Dark mode
                    "dark:text-blue-300"
                  )}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={expense ? "edit-title" : "add-title"}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={variants}
                      transition={{ duration: 0.2 }}
                    >
                      {expense ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
                    </motion.div>
                  </AnimatePresence>
                </DialogTitle>
                
                <DialogDescription 
                  className={cn(
                    "mt-1.5",
                    // Light mode
                    "text-blue-600/70",
                    // Dark mode
                    "dark:text-blue-300/70"
                  )}
                >
                  {expense 
                    ? "Modifiez les informations de votre charge récurrente. Les modifications seront appliquées immédiatement."
                    : "Ajoutez une nouvelle charge récurrente en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ligne séparatrice avec dégradé */}
        <div className={cn(
          "h-px w-full",
          // Light mode
          "bg-gradient-to-r from-transparent via-blue-100 to-transparent",
          // Dark mode
          "dark:from-transparent dark:via-blue-900/30 dark:to-transparent"
        )} />
        
        {/* Conteneur pour le formulaire avec fond subtil */}
        <div className={cn(
          "p-6",
          // Light mode
          "bg-white",
          // Dark mode
          "dark:bg-gray-800/95"
        )}>
          <RecurringExpenseForm
            expense={expense}
            onSuccess={() => onOpenChange?.(false)}
            onCancel={() => onOpenChange?.(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

