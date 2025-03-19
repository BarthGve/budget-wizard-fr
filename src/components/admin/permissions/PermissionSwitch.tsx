
import { Switch } from "@/components/ui/switch";
import { ProfileType } from "@/types/profile";

interface PermissionSwitchProps {
  profile: ProfileType;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const PermissionSwitch = ({ profile, onChange, disabled = false }: PermissionSwitchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={profile === "pro"}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <span className="text-sm text-muted-foreground">
        {profile === "pro" ? "Pro" : "Basic"}
      </span>
    </div>
  );
};
