
import { Switch } from "@/components/ui/switch";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NotificationToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  tooltipContent?: string;
  onCheckedChange: (checked: boolean) => void;
}

export const NotificationToggle = ({
  id,
  label,
  description,
  checked,
  disabled = false,
  tooltipContent,
  onCheckedChange
}: NotificationToggleProps) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5">
        <div className="flex items-center">
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-900 cursor-pointer"
          >
            {label}
          </label>
          
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};
