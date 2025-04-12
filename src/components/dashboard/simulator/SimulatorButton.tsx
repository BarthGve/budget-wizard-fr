
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
    "min-w-[120px]",
    "flex items-center justify-center gap-2",
    "bg-primary/10 text-primary border-primary/30",
    "hover:bg-primary/20 hover:border-primary/40",
    "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none",
    "active:scale-[0.98] transition-all duration-150 ease-in-out",
    isMobile ? "text-xs px-2 py-1" : "text-sm px-4 py-2 rounded-md"
  )}
>
  <Calculator
    className={cn(
      isMobile ? "h-3 w-3" : "h-4 w-4",
      "text-primary"
    )}
  />
  <span>Simulateur</span>
</Button>
      <FinanceSimulator open={open} onOpenChange={setOpen} />
    </>
  );
};
