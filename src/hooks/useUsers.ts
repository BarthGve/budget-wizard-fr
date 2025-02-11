
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

export const useUsers = (page: number, pageSize: number) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: { users: userData }, error: usersError } = await supabase.auth.admin.listUsers({
        page: page - 1,
        perPage: pageSize,
      });

      if (usersError) throw usersError;

      const userIds = userData?.map(user => user.id) || [];
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const roleMap = new Map();
      rolesData?.forEach(role => {
        roleMap.set(role.user_id, role.role);
      });

      const formattedUsers = userData?.map(user => ({
        id: user.id,
        email: user.email || '',
        role: roleMap.get(user.id) || "user",
        created_at: user.created_at,
      })) || [];

      setUsers(formattedUsers);
      setTotalPages(Math.ceil((userData?.length || 0) / pageSize));
    } catch (error: any) {
      toast.error("Erreur lors du chargement des utilisateurs");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: userId, 
          role: newRole 
        }]);

      if (insertError) throw insertError;

      toast.success("Rôle mis à jour avec succès");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour du rôle");
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast.success("Utilisateur supprimé avec succès");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return {
    users,
    totalPages,
    loading,
    handleRoleChange,
    handleDeleteUser,
    refreshUsers: fetchUsers
  };
};
