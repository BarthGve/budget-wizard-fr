
import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { BudgetSimulatorDialog } from "./BudgetSimulatorDialog";
import { motion } from "framer-motion";

export function BudgetSimulatorTrigger() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 border-dashed"
        >
          <Calculator className="h-4 w-4" />
          <span>Simulateur</span>
        </Button>
      </motion.div>
      
      <BudgetSimulatorDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  );
}
