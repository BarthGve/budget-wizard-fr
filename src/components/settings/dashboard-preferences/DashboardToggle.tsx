
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardToggleProps {
  label: string;
  description: string;
  tooltipContent: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const DashboardToggle = ({
  label,
  description,
  tooltipContent,
  checked,
  onCheckedChange,
  disabled = false
}: DashboardToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Label>{label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};
