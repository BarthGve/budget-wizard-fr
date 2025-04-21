
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const PropertiesHeader = () => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className={cn(
        "flex items-center justify-between gap-6 w-full mb-4 mt-2",
        isMobile ? "flex-col items-start gap-2 px-1" : "py-4"
      )}
    >
      <div className={cn(
        "flex items-center gap-4",
        isMobile && "gap-2"
      )}>
        {/* Icône maison cerclée */}
        <span className={cn(
          "p-3 rounded-xl shadow-md border bg-gradient-to-br from-quaternary-100 to-quaternary-50",
          "dark:bg-gradient-to-br dark:from-quaternary-900/30 dark:to-quaternary-900/10"
        )}>
          <Home className="h-7 w-7 text-quaternary-600 dark:text-quaternary-300" />
        </span>
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-gradient-to-r from-quaternary-600 via-primary-600 to-primary-400 bg-clip-text text-transparent animate-fade-in",
            isMobile && "text-2xl"
          )}>
            Propriétés
          </h1>
          <p className={cn("text-muted-foreground", isMobile && "text-xs")}>
            Gérez vos biens immobiliers et suivez leurs performances
          </p>
        </div>
      </div>
      <div className={isMobile ? "mt-3 w-full" : ""}>
        <AddPropertyDialog />
      </div>
    </motion.div>
  );
};
