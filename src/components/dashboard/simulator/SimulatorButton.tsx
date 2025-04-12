
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
  size={isMobile ? "sm" : "default"}
  className={cn(
    "group flex items-center justify-center gap-2 rounded-lg",
    "min-w-[140px] px-4 py-2 font-medium shadow-lg",
    "bg-primary/10 text-primary border border-primary/20",
    "hover:bg-primary/20 hover:border-primary/30",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    "transition-all duration-150 ease-in-out",
    "active:scale-[0.97]",
    isMobile ? "text-xs" : "text-sm"
  )}
>
  <Calculator
    className={cn(
      "transition-transform duration-200 ease-in-out group-hover:rotate-6",
      isMobile ? "w-3.5 h-3.5" : "w-4 h-4",
      "text-primary"
    )}
  />
  <span>Simuler mon budget</span>
</Button>
      <FinanceSimulator open={open} onOpenChange={setOpen} />
    </>
  );
};
