
import { TableCell, TableRow } from "@/components/ui/table";
import { UserActions } from "./UserActions";
import type { User } from "@/hooks/useUsers";

interface UserTableRowProps {
  user: User;
  onRoleChange: (userId: string, newRole: "user" | "admin") => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow = ({ user, onRoleChange, onDelete }: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <UserActions
          userId={user.id}
          currentRole={user.role}
          onRoleChange={onRoleChange}
          onDelete={onDelete}
        />
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};
