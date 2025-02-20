
import { useState } from "react";
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
    handleProfileChange,
    handleDeleteUser,
    refreshUsers
  } = useUsers(page, PAGE_SIZE);

  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Listing des utilisateurs</h2>
          <p className="text-sm text-muted-foreground">
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="divide-y">
          {users.map(user => (
            <UserTableRow 
              key={user.id} 
              user={user} 
              onRoleChange={handleRoleChange} 
              onProfileChange={handleProfileChange}
              onDelete={handleDeleteUser} 
            />
          ))}
        </div>
      </div>

      <UserTablePagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <CreateUserDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onUserCreated={refreshUsers} />
    </div>;
};
