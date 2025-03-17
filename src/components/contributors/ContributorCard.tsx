import { Contributor } from "@/types/contributor";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContributorAvatar } from "./ContributorAvatar";
import { ContributorCardActions } from "./ContributorCardActions";
import { EditContributorDialog } from "./EditContributorDialog";
import { DeleteContributorDialog } from "./DeleteContributorDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Assurez-vous d'avoir ce hook

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
  
  // Détection des tablettes
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useMediaQuery("(max-width: 639px)");

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

  // Rendus spécifiques pour les modales sur tablette
  const renderEditDialog = () => (
    <EditContributorDialog
      isOpen={isEditDialogOpen}
      onClose={() => setIsEditDialogOpen(false)}
      onSave={handleEditContributor}
      contributor={contributor}
      // Ajustements spécifiques pour tablette
      fullScreen={isMobile}
      maxWidth={isTablet ? "85%" : "600px"}
      maxHeight={isTablet || isMobile ? "95vh" : "auto"}
      scrollable={isTablet || isMobile}
    />
  );

  const renderDeleteDialog = () => (
    <DeleteContributorDialog
      isOpen={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(false)}
      onConfirm={handleDeleteConfirm}
      contributor={contributor}
      // Ajustements spécifiques pour tablette
      maxWidth={isTablet ? "90%" : "450px"}
    />
  );

  return (
    <>
      <div 
        className={`
          relative 
          flex 
          ${isTablet ? 'flex-col' : 'flex-row'} 
          ${isTablet ? 'items-center' : 'items-start'} 
          gap-4 
          p-4 
          rounded-lg 
          transition-all 
          duration-200 
          ${isDarkTheme ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-white hover:bg-gray-50'}
          ${isTablet ? 'text-center' : 'text-left'}
        `}
        style={{
          boxShadow: isDarkTheme 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Avatar - Centré sur tablette */}
        <ContributorAvatar 
          contributor={contributor} 
          avatarUrl={contributor.is_owner && profile ? profile.avatar_url : null}
          className={isTablet ? 'mx-auto mb-2' : ''}
          size={isTablet ? 'large' : 'medium'}
        />

        {/* Informations - Adaptées pour tablette */}
        <div className={`
          flex-1 
          ${isTablet ? 'w-full' : 'w-auto'}
          ${isTablet ? 'mb-4' : ''}
        `}>
          <h3 className={`
            font-medium 
            ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}
            ${isTablet ? 'text-lg' : 'text-base'}
          `}>
            {contributor.name}
          </h3>
          <p className={`
            text-sm 
            ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}
            ${isTablet ? 'mt-1' : 'mt-0.5'}
          `}>
            {contributor.is_owner ? 'Propriétaire' : 
             contributor.is_secondary_owner ? 'Copropriétaire' : 'Contributeur'}
          </p>
          
          {contributor.contribution_percentage > 0 && (
            <p className={`
              text-sm 
              mt-2
              ${isDarkTheme ? 'text-green-400' : 'text-green-600'}
            `}>
              Contribution: {contributor.contribution_percentage}%
            </p>
          )}
        </div>

        {/* Actions - Positionnés différemment sur tablette */}
        <div className={`
          ${isTablet ? 'w-full flex justify-center' : 'absolute top-4 right-4'}
        `}>
          <ContributorCardActions 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
            isOwner={contributor.is_owner}
            layoutMode={isTablet ? 'horizontal' : 'vertical'}
          />
        </div>
      </div>

      {/* Modales adaptées pour tablette */}
      {renderEditDialog()}
      {renderDeleteDialog()}
    </>
  );
};

  // S'assurer que percentage_contribution a une valeur par défaut
  const percentageContribution = contributor.percentage_contribution ?? 0;

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
            {percentageContribution.toFixed(1)}% du budget
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
