
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown } from "lucide-react";
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
        <SelectTrigger className="w-[130px] bg-white border-gray-200">
          <SelectValue />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Membre</SelectItem>
          <SelectItem value="admin">Administrateur</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(userId)}
        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
