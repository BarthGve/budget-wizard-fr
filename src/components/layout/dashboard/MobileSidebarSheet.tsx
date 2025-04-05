
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { Sidebar } from "../sidebar";

interface MobileSidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebarSheet = ({ open, onOpenChange }: MobileSidebarSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Utilisation de la classe appropriée sur SheetContent, sans overlayClassName */}
      <SheetContent 
        side="left" 
        className="p-0 border-r shadow-xl w-4/5 max-w-[280px] sm:max-w-[320px]"
      >
        <div className="h-full overflow-hidden">
          <Sidebar onClose={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
