import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { CreditDialog } from "../CreditDialog";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

export const CreditsHeader = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isMobile = useIsMobile();

  return (
    <motion.div 
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6",
        isMobile && "mt-14"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-2.5 rounded-lg shadow-sm mt-0.5",
            "bg-primary/10 dark:bg-primary/20"
          )}
        >
          <CreditCard className="h-6 w-6 text-primary" />
        </motion.div>

        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            "bg-gradient-to-r from-primary to-primary/60 dark:from-primary dark:to-primary/70"
          )}>
            Crédits
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-muted-foreground"
          )}>
            Gérez vos crédits et leurs échéances
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <CreditDialog 
          trigger={
            <Button 
              variant="outline"
              className={cn(
                "h-10 px-4 border transition-all duration-200 rounded-md",
                "hover:scale-[1.02] active:scale-[0.98]",
                "bg-background border-primary/20 text-primary",
                "hover:bg-primary/5 hover:border-primary/40 hover:text-primary",
                "dark:hover:bg-primary/10 dark:hover:border-primary/40 dark:hover:text-primary"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 10px -2px rgba(255, 255, 255, 0.05)"
                  : "0 2px 10px -2px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                  "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                )}>
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="font-medium text-sm">Ajouter</span>
              </div>
            </Button>
          } 
        />
      </motion.div>
    </motion.div>
  );
};