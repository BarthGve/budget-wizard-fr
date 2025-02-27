
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserActions } from "./UserActions";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldOff } from "lucide-react";
import type { User } from "@/hooks/useUsers";

interface UserTableRowProps {
  user: User;
  onRoleChange: (userId: string, newRole: "user" | "admin") => void;
  onProfileChange: (userId: string, newProfile: "basic" | "pro") => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow = ({ user, onRoleChange, onProfileChange, onDelete }: UserTableRowProps) => {
  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center w-full">
      <div className="flex items-center gap-4 min-w-0">
        <Avatar>
          {user.avatar_url ? (
            <AvatarImage 
              src={user.avatar_url} 
              alt={user.email}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('[role="img"]');
                if (fallback && fallback instanceof HTMLElement) {
                  fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(user.email)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 min-w-0">
          <p className="font-medium truncate">{user.email.split('@')[0]}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            {user.is_verified ? (
              <Badge variant="default" className="flex items-center gap-1 shrink-0">
                <Shield className="h-3 w-3" />
                <span>Vérifié</span>
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1 shrink-0">
                <ShieldOff className="h-3 w-3" />
                <span>Non vérifié</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <UserActions
        userId={user.id}
        userEmail={user.email}
        currentRole={user.role}
        currentProfile={user.profile_type}
        isVerified={user.is_verified}
        onRoleChange={onRoleChange}
        onProfileChange={onProfileChange}
        onDelete={onDelete}
      />
    </div>
  );
};
