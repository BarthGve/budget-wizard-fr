
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { FinanceSimulator } from "./FinanceSimulator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const SimulatorButton = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size={isMobile ? "sm" : "default"}
        className={cn(
          "min-w-[110px] justify-between",
          "bg-purple-50 border-purple-100 hover:bg-purple-100",
          "dark:bg-purple-950/30 dark:border-purple-800/50 dark:hover:bg-purple-900/40",
          isMobile ? "text-xs" : ""
        )}
      >
        <Calculator className={cn(
          "mr-2", 
          isMobile ? "h-3 w-3" : "h-4 w-4",
          "text-primary"
        )} />
        <span className="text-primary">Simulateur</span>
      </Button>
      <FinanceSimulator open={open} onOpenChange={setOpen} />
    </>
  );
};
