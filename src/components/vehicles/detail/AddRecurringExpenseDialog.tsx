
import { Button } from "@/components/ui/button";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AddRecurringExpenseDialogProps {
  vehicleId: string;
}

export function AddRecurringExpenseDialog({
  vehicleId
}: AddRecurringExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "sm"} 
        className={cn(
          "flex items-center gap-1",
          isMobile && "text-xs h-8"
        )}
        onClick={() => setOpen(true)}
      >
        <Plus className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {isMobile ? "Charge" : "Charge récurrente"}
      </Button>
      
      <RecurringExpenseDialog 
        open={open} 
        onOpenChange={setOpen}
        initialVehicleId={vehicleId}
      />
    </>
  );
}
