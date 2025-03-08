
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
  tooltipContent?: string; // Ajout de la prop optionnelle
}

export const NotificationToggle = ({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
  tooltipContent,
}: NotificationToggleProps) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Label className="text-base">{label}</Label>
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
