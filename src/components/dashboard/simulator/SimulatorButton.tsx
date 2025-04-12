
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { FinanceSimulator } from "./FinanceSimulator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const SimulatorButton = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className={cn(
            "min-w-[110px] justify-between transition-all duration-200",
            "bg-secondary-50/80 hover:bg-secondary-100/90 border-secondary-200/50",
            "dark:bg-secondary-900/40 dark:hover:bg-secondary-800/60 dark:border-secondary-700/40",
            "shadow-sm shadow-secondary-200/10 dark:shadow-secondary-900/5",
            "group",
            isMobile && "text-xs"
          )}
        >
          <Calculator className={cn(
            "mr-2 transition-transform duration-300 ease-out", 
            "group-hover:rotate-12",
            isMobile ? "h-3 w-3" : "h-4 w-4",
            "text-secondary-500 dark:text-secondary-400"
          )} />
          <span className="text-secondary-700 dark:text-secondary-300">Simulateur</span>
        </Button>
      </motion.div>
      <FinanceSimulator open={open} onOpenChange={setOpen} />
    </>
  );
};
