
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileType } from "@/types/profile";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";

export type PagePermissionFeatures = {
  [key: string]: {
    required_profile: ProfileType;
  };
};

export interface PagePermission {
  id: string;
  page_path: string;
  page_name: string;
  required_profile: ProfileType;
  feature_permissions: PagePermissionFeatures;
}

type SupabasePagePermission = Database['public']['Tables']['page_permissions']['Row'];

export const usePagePermissionsManagement = () => {
  const { data: permissions = [], refetch, isLoading } = useQuery<PagePermission[]>({
    queryKey: ["pagePermissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*")
        .order("page_name");

      if (error) throw error;

      // Transformation des données pour assurer le bon typage
      return data.map((permission: SupabasePagePermission): PagePermission => ({
        ...permission,
        feature_permissions: (permission.feature_permissions as PagePermissionFeatures) || {},
        required_profile: permission.required_profile as ProfileType,
      }));
    },
  });

  // Vérification de l'existence de l'entrée pour les véhicules
  useEffect(() => {
    const checkVehiclesPermission = async () => {
      if (!isLoading && permissions.length > 0) {
        const vehiclesPermission = permissions.find(p => p.page_path === '/vehicles');
        
        if (!vehiclesPermission) {
          try {
            const { error } = await supabase
              .from("page_permissions")
              .insert({
                page_path: '/vehicles',
                page_name: 'Véhicules',
                required_profile: 'basic',
                feature_permissions: {}
              });
              
            if (error) throw error;
            
            toast.success("Permission pour la page véhicules ajoutée avec succès");
            refetch();
          } catch (error) {
            toast.error("Erreur lors de l'ajout de la permission pour la page véhicules");
            console.error("Error adding vehicles permission:", error);
          }
        }
      }
    };
    
    checkVehiclesPermission();
  }, [isLoading, permissions, refetch]);

  const handleProfileChange = async (permissionId: string, isPro: boolean) => {
    // Vérification pour le tableau de bord
    if (permissions?.find(p => p.id === permissionId)?.page_path === '/dashboard') {
      toast.error("Le tableau de bord doit rester accessible à tous les utilisateurs");
      return;
    }

    try {
      const { error } = await supabase
        .from("page_permissions")
        .update({ required_profile: isPro ? "pro" : "basic" })
        .eq("id", permissionId);

      if (error) throw error;

      toast.success("Permission mise à jour avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la permission");
      console.error("Error updating permission:", error);
    }
  };

  const handleFeaturePermissionChange = async (permissionId: string, featureKey: string, isPro: boolean) => {
    const permission = permissions?.find(p => p.id === permissionId);
    if (!permission) return;

    const updatedFeaturePermissions = {
      ...permission.feature_permissions,
      [featureKey]: {
        required_profile: isPro ? "pro" : "basic"
      }
    };

    try {
      const { error } = await supabase
        .from("page_permissions")
        .update({ feature_permissions: updatedFeaturePermissions })
        .eq("id", permissionId);

      if (error) throw error;

      toast.success("Permission de fonctionnalité mise à jour avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la permission");
      console.error("Error updating feature permission:", error);
    }
  };

  const getPageDescription = (pagePath: string) => {
    const descriptions: { [key: string]: string } = {
      '/savings': "Permet aux utilisateurs de gérer leurs projets d'épargne et leurs versements mensuels.",
      '/dashboard': "Page d'accueil avec le résumé des finances.",
      '/vehicles': "Permet aux utilisateurs de gérer leurs véhicules et suivre les dépenses associées.",
      '/properties': "Gestion du patrimoine immobilier et des dépenses associées.",
      '/expenses': "Suivi des dépenses courantes et des enseignes.",
      '/contributors': "Gestion des revenus et des contributeurs au budget.",
      '/recurring-expenses': "Gestion des charges et dépenses récurrentes.",
      '/credits': "Suivi des crédits en cours et remboursés.",
      '/stocks': "Suivi des investissements boursiers."
    };
    return descriptions[pagePath] || "Page de l'application";
  };

  const getFeaturePermission = (permission: PagePermission, featureKey: string) => {
    return permission.feature_permissions?.[featureKey]?.required_profile === 'pro';
  };

  return {
    permissions,
    isLoading,
    handleProfileChange,
    handleFeaturePermissionChange,
    getPageDescription,
    getFeaturePermission
  };
};
