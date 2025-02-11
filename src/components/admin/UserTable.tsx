
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CreateUserDialog } from "./CreateUserDialog";
import { UserTableRow } from "./UserTableRow";
import { UserTablePagination } from "./UserTablePagination";
import { useUsers } from "@/hooks/useUsers";

const PAGE_SIZE = 10;

export const UserTable = () => {
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    users,
    totalPages,
    loading,
    handleRoleChange,
    handleDeleteUser,
    refreshUsers
  } = useUsers(page, PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Utilisateurs</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onRoleChange={handleRoleChange}
                onDelete={handleDeleteUser}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <UserTablePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={refreshUsers}
      />
    </div>
  );
};
