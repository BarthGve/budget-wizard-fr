
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
         
     
          isMobile ? "text-xs" : ""
        )}
      >
        <Calculator className={cn(
          "mr-2", 
          isMobile ? "h-3 w-3" : "h-4 w-4",
          "text-purple-500 dark:text-purple-400"
        )} />
        <span className="text-secondary">Simulateur</span>
      </Button>
      <FinanceSimulator open={open} onOpenChange={setOpen} />
    </>
  );
};
