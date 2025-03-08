
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table2 } from "lucide-react";

interface FeedbackViewToggleProps {
  view: "table" | "kanban";
  onChange: (view: "table" | "kanban") => void;
}

export const FeedbackViewToggle = ({ view, onChange }: FeedbackViewToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange("table")}
      >
        <Table2 className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "kanban" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange("kanban")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};
