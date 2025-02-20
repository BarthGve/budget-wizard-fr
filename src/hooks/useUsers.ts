
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileType } from "@/types/profile";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  profile_type: ProfileType;
  created_at: string;
  avatar_url: string | null;
}

export const useUsers = (page: number, pageSize: number) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: usersData, error: usersError } = await supabase
        .rpc('list_users', { 
          page_number: page - 1,
          page_size: pageSize 
        });

      if (usersError) throw usersError;

      const { data: totalUsers, error: countError } = await supabase
        .rpc('get_total_users');

      if (countError) throw countError;

      const userIds = usersData?.map(user => user.id) || [];
      
      // Get roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      // Get profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, profile_type')
        .in('id', userIds);

      const roleMap = new Map();
      rolesData?.forEach(role => {
        roleMap.set(role.user_id, role.role);
      });

      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile.profile_type);
      });

      const formattedUsers = usersData?.map(user => ({
        id: user.id,
        email: user.email || '',
        role: roleMap.get(user.id) || "user",
        profile_type: profileMap.get(user.id) || "basic",
        created_at: user.created_at,
        avatar_url: user.avatar_url
      })) || [];

      setUsers(formattedUsers);
      setTotalPages(Math.ceil(totalUsers / pageSize));
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

  const handleProfileChange = async (userId: string, newProfile: ProfileType) => {
    try {
      const { error } = await supabase.rpc('update_user_profile', {
        target_user_id: userId,
        new_profile: newProfile
      });

      if (error) throw error;

      toast.success("Profil mis à jour avec succès");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('delete_user', {
        user_id_to_delete: userId
      });
      
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
    handleProfileChange,
    handleDeleteUser,
    refreshUsers: fetchUsers
  };
};
