
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
          "bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-white hover:border-primary/30",
          "dark:bg-gray-900/80 dark:hover:bg-gray-900 dark:border-primary/30",
          isMobile ? "text-xs" : ""
        )}
      >
        <Calculator className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
        Simulateur
      </Button>
      <FinanceSimulator open={open} onOpenChange={setOpen} />
    </>
  );
};
