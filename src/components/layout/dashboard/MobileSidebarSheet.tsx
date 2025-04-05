
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "../sidebar";

interface MobileSidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebarSheet = ({ open, onOpenChange }: MobileSidebarSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="p-0 border-r shadow-xl w-4/5 max-w-[280px] sm:max-w-[320px]"
        overlayClassName="backdrop-blur-sm"
      >
        <div className="h-full overflow-hidden">
          <Sidebar onClose={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
