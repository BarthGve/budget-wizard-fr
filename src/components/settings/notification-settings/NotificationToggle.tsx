
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const NotificationToggle = ({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: NotificationToggleProps) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-1">
        <Label className="text-base">{label}</Label>
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
