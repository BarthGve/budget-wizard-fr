
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserActionsProps {
  userId: string;
  currentRole: "user" | "admin";
  onRoleChange: (userId: string, newRole: "user" | "admin") => void;
  onDelete: (userId: string) => void;
}

export const UserActions = ({
  userId,
  currentRole,
  onRoleChange,
  onDelete,
}: UserActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentRole}
        onValueChange={(value: "user" | "admin") => onRoleChange(userId, value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Utilisateur</SelectItem>
          <SelectItem value="admin">Administrateur</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(userId)}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
