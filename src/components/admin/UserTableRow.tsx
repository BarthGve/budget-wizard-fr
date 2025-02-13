
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserActions } from "./UserActions";
import type { User } from "@/hooks/useUsers";

interface UserTableRowProps {
  user: User;
  onRoleChange: (userId: string, newRole: "user" | "admin") => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow = ({ user, onRoleChange, onDelete }: UserTableRowProps) => {
  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <Avatar>
          {user.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt={user.email} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.email)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{user.email.split('@')[0]}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <UserActions
        userId={user.id}
        currentRole={user.role}
        onRoleChange={onRoleChange}
        onDelete={onDelete}
      />
    </div>
  );
};
