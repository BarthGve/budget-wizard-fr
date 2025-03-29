
import { useState, useRef } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DialogHeader } from "./DialogHeader";
import { RecurringExpense } from "../types";
import { DialogContent } from "./DialogContent";

interface MobileSheetProps {
  expense?: RecurringExpense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  needsScrolling: boolean;
  trigger?: React.ReactNode;
  initialVehicleId?: string;
}

/**
 * Composant Sheet pour l'affichage mobile des charges récurrentes
 */
export const MobileSheet = ({
  expense,
  open,
  onOpenChange,
  isEditMode,
  needsScrolling,
  trigger,
  initialVehicleId
}: MobileSheetProps) => {
  // Référence pour le conteneur de contenu
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent 
        side="bottom"
        className={cn(
          "px-0 pb-0 rounded-t-xl h-[92vh] overflow-hidden",
          "border-t shadow-lg"
        )}
      >
        <div 
          className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )}
        />
        
        <div 
          ref={contentRef} 
          className={cn(
            "h-full overflow-y-auto pb-safe pt-4 px-0",
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
            "dark:scrollbar-thumb-gray-700"
          )}
        >
          {/* En-tête du sheet avec une version plus compacte */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4"
          >
            <DialogHeader isEditMode={isEditMode} />
          </motion.div>
          
          {/* Contenu du dialogue avec formulaire */}
          <DialogContent
            expense={expense}
            isEditMode={isEditMode}
            needsScrolling={needsScrolling}
            onOpenChange={onOpenChange}
            initialVehicleId={initialVehicleId}
            className="px-4 pb-20" // Padding supplémentaire en bas
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
