
import { Contributor } from "@/types/contributor";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContributorAvatar } from "./ContributorAvatar";
import { ContributorCardActions } from "./ContributorCardActions";
import { EditContributorDialog } from "./EditContributorDialog";
import { DeleteContributorDialog } from "./DeleteContributorDialog";

interface ContributorCardProps {
  contributor: Contributor;
  onEdit: (contributor: Contributor) => void;
  onDelete: (id: string) => void;
}

export const ContributorCard = ({
  contributor,
  onEdit,
  onDelete,
}: ContributorCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const isDarkTheme = theme === "dark";

  // Fetch profile avatar for owner
  const { data: profile } = useQuery({
    queryKey: ["profile-avatar", contributor.is_owner],
    enabled: contributor.is_owner,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEditContributor = async (updatedContributor: Contributor) => {
    await onEdit(updatedContributor);
    setIsEditDialogOpen(false);
    
    // Invalider les données du dashboard pour forcer un rafraîchissement
    queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
  };

  const handleDeleteConfirm = async () => {
    await onDelete(contributor.id);
    setIsDeleteDialogOpen(false);
    
    // Invalider les données du dashboard pour forcer un rafraîchissement
    queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded-lg bg-card dark:bg-card">
      <div className="flex items-center space-x-4">
        <ContributorAvatar 
          name={contributor.name}
          avatarUrl={profile?.avatar_url}
          isOwner={contributor.is_owner}
          isDarkTheme={isDarkTheme}
        />
        <div>
          <h3 className="font-medium">{contributor.name}</h3>
          {contributor.email && (
            <p className="text-sm text-gray-500">{contributor.email}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-medium">{contributor.total_contribution} €</p>
          <p className="text-sm text-gray-500">
            {contributor.percentage_contribution.toFixed(1)}% du budget
          </p>
        </div>
        
        <ContributorCardActions 
          isOwner={contributor.is_owner}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <EditContributorDialog
        contributor={contributor}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleEditContributor}
      />

      {!contributor.is_owner && (
        <DeleteContributorDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};
