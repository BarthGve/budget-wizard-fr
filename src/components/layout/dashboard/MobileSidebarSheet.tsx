
import React from "react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Sidebar } from "../Sidebar";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileSidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebarSheet = ({ open, onOpenChange }: MobileSidebarSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="p-0 mobile-sidebar-floating rounded-r-2xl bg-background/90 backdrop-blur-md w-[240px] border-0 overflow-hidden"
      >
        <div className="relative">
          <SheetClose className="absolute right-3 top-3 z-50 rounded-full bg-gray-100 dark:bg-gray-800 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </SheetClose>
        </div>
        <Sidebar onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
};
