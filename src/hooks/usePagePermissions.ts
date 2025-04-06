
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useAuth } from "@/hooks/useAuth";

export interface PagePermission {
  page_path: string;
  features: Record<string, boolean>;
  access_level: "all" | "pro" | "admin";
  id?: string;
  page_name?: string;
  created_at?: string;
  updated_at?: string;
}

export const usePagePermissions = () => {
  const { user } = useAuth();
  
  // Obtenir le profil utilisateur
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      return data as Profile;
    },
    enabled: !!user?.id
  });
  
  // Vérifier si l'utilisateur est admin
  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      
      return !!data;
    },
    enabled: !!user?.id
  });
  
  // Vérifier si l'utilisateur a un profil basique
  const isBasicProfile = !!(profile && profile.profile_type === "basic");
  
  // Obtenir les permissions des pages
  const { data: permissionsData = [] } = useQuery({
    queryKey: ["page-permissions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_permissions")
        .select("*");
        
      return data || [];
    }
  });
  
  // Transformer les données brutes en permissions correctement typées
  const permissions: PagePermission[] = permissionsData.map(p => ({
    page_path: p.page_path,
    page_name: p.page_name,
    id: p.id,
    created_at: p.created_at,
    updated_at: p.updated_at,
    // Transformer required_profile en access_level
    access_level: p.required_profile === "basic" ? "all" : p.required_profile === "pro" ? "pro" : "admin",
    // Transformer feature_permissions en features
    features: typeof p.feature_permissions === 'object' ? p.feature_permissions as Record<string, boolean> : {}
  }));
  
  // Vérifier si l'utilisateur peut accéder à une page
  const canAccessPage = (pagePath: string) => {
    // Les admins ont accès à tout
    if (isAdmin) return true;
    
    // Chercher les permissions pour cette page
    const pagePermission = permissions.find(p => p.page_path === pagePath);
    
    // Si pas de permission définie, autoriser par défaut
    if (!pagePermission) return true;
    
    // Vérifier le niveau d'accès requis
    if (pagePermission.access_level === "all") return true;
    if (pagePermission.access_level === "pro" && profile?.profile_type === "pro") return true;
    if (pagePermission.access_level === "admin" && isAdmin) return true;
    
    return false;
  };
  
  // Vérifier si l'utilisateur peut accéder à une fonctionnalité spécifique sur une page
  const canAccessFeature = (pagePath: string, featureKey: string) => {
    // Les admins ont accès à tout
    if (isAdmin) return true;
    
    // Chercher les permissions pour cette page
    const pagePermission = permissions.find(p => p.page_path === pagePath);
    
    // Si pas de permission définie pour la page ou la fonctionnalité, autoriser par défaut
    if (!pagePermission || !pagePermission.features[featureKey]) return true;
    
    // Si la fonctionnalité nécessite un profil pro, vérifier le type de profil
    if (pagePermission.features[featureKey] && profile?.profile_type === "pro") return true;
    
    return false;
  };

  // Vérifier si l'utilisateur a accès à une page spécifique
  const hasAccess = (pagePath: string) => {
    return canAccessPage(pagePath);
  };
  
  return {
    profile,
    permissions,
    isAdmin,
    isBasicProfile,
    canAccessPage,
    canAccessFeature,
    hasAccess
  };
};
