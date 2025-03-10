import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { RecurringExpenseForm } from "./RecurringExpenseForm";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecurringExpenseDialogProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
    periodicity: "monthly" | "quarterly" | "yearly";
    debit_day: number;
    debit_month: number | null;
    logo_url?: string;
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
  const [contentHeight, setContentHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  const isEditMode = !!expense;

  // Mesurer la hauteur de la fenêtre et du contenu pour déterminer s'il faut activer le défilement
  useEffect(() => {
    if (open) {
      const updateHeights = () => {
        setWindowHeight(window.innerHeight);
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      };

      // Mettre à jour immédiatement et après un court délai pour s'assurer que le contenu est chargé
      updateHeights();
      const timer = setTimeout(updateHeights, 100);

      window.addEventListener('resize', updateHeights);
      
      return () => {
        window.removeEventListener('resize', updateHeights);
        clearTimeout(timer);
      };
    }
  }, [open]);

  // Déterminer si le contenu nécessite un défilement (ajouter une marge pour l'UI)
  const needsScrolling = contentHeight > 0 && contentHeight + 80 > windowHeight;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className={cn(
              "p-0 border-0 shadow-2xl sm:max-w-[600px] overflow-hidden",
              needsScrolling ? "max-h-[calc(100vh-40px)]" : "",
              // Light mode
              "bg-white",
              // Dark mode
              "dark:bg-gray-800/95"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)"
            }}
          >
            <div ref={contentRef} className="flex flex-col max-h-full">
              {/* En-tête stylisée avec dégradé et icône - fixe, ne défile pas */}
              <div 
                className={cn(
                  "relative px-6 py-6 flex-shrink-0",
                  // Light mode
                  isEditMode 
                    ? "bg-gradient-to-br from-amber-50 to-white" 
                    : "bg-gradient-to-br from-blue-50 to-white",
                  // Dark mode
                  isEditMode
                    ? "dark:bg-gradient-to-br dark:from-amber-900/10 dark:to-gray-800/95"
                    : "dark:bg-gradient-to-br dark:from-blue-900/10 dark:to-gray-800/95"
                )}
              >
                {/* Élément décoratif circulaire */}
                <div 
                  className={cn(
                    "absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-20",
                    // Light mode
                    isEditMode
                      ? "bg-gradient-to-br from-amber-300 to-amber-500"
                      : "bg-gradient-to-br from-blue-400 to-blue-600",
                    // Dark mode
                    "dark:opacity-10"
                  )}
                />
                
                <DialogHeader className="relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Icône du dialogue */}
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                        // Light mode - édition ou création
                        isEditMode
                          ? "bg-amber-100 text-amber-600" 
                          : "bg-blue-100 text-blue-600",
                        // Dark mode - édition ou création
                        isEditMode
                          ? "dark:bg-amber-900/20 dark:text-amber-400" 
                          : "dark:bg-blue-900/20 dark:text-blue-400"
                      )}
                    >
                      {isEditMode ? (
                        <Edit size={24} />
                      ) : (
                        <Plus size={24} />
                      )}
                    </div>
                    
                    <div>
                      <DialogTitle 
                        className={cn(
                          "text-xl font-bold tracking-tight",
                          // Light mode
                          "text-gray-800",
                          // Dark mode
                          "dark:text-gray-100"
                        )}
                      >
                        {isEditMode ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
                      </DialogTitle>
                      
                      <DialogDescription 
                        className={cn(
                          "mt-1.5 text-sm",
                          // Light mode
                          "text-gray-600",
                          // Dark mode
                          "dark:text-gray-400"
                        )}
                      >
                        {isEditMode 
                          ? "Modifiez les informations de votre charge récurrente. Les modifications seront appliquées immédiatement."
                          : "Ajoutez une nouvelle charge récurrente en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>
              
              {/* Ligne séparatrice avec dégradé */}
              <div 
                className={cn(
                  "h-px w-full flex-shrink-0",
                  // Light mode - édition ou création
                  isEditMode
                    ? "bg-gradient-to-r from-transparent via-amber-100 to-transparent"
                    : "bg-gradient-to-r from-transparent via-blue-100 to-transparent",
                  // Dark mode - édition ou création
                  isEditMode
                    ? "dark:bg-gradient-to-r dark:from-transparent dark:via-amber-900/20 dark:to-transparent"
                    : "dark:bg-gradient-to-r dark:from-transparent dark:via-blue-900/20 dark:to-transparent"
                )} 
              />
              
              {/* Zone de défilement pour le contenu du formulaire */}
              {needsScrolling ? (
                <ScrollArea 
                  className={cn(
                    "flex-grow", 
                    // Light mode
                    "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                    // Dark mode
                    "dark:scrollbar-thumb-gray-700"
                  )}
                >
                  <div className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RecurringExpenseForm
                        expense={expense}
                        onSuccess={() => onOpenChange?.(false)}
                        onCancel={() => onOpenChange?.(false)}
                        variant={isEditMode ? "edit" : "create"}
                      />
                    </motion.div>
                  </div>
                </ScrollArea>
              ) : (
                // Sans défilement si le contenu tient dans l'écran
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RecurringExpenseForm
                      expense={expense}
                      onSuccess={() => onOpenChange?.(false)}
                      onCancel={() => onOpenChange?.(false)}
                      variant={isEditMode ? "edit" : "create"}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
