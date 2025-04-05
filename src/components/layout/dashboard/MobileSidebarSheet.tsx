
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "../Sidebar";
import { cn } from "@/lib/utils";

interface MobileSidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebarSheet = ({ open, onOpenChange }: MobileSidebarSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="p-0 border-r border-gray-100 dark:border-gray-800 rounded-r-xl bg-background/95 backdrop-blur-sm w-[240px]"
      >
        <Sidebar onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
};
