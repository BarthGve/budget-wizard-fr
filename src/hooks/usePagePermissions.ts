import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileType } from "@/types/profile";

interface PagePermission {
  page_path: string;
  page_name: string;
  required_profile: ProfileType;
  feature_permissions: {
    [key: string]: {
      required_profile: ProfileType;
    };
  };
}

export const usePagePermissions = () => {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      // Ne pas traiter la palette de couleur ici, la laisser telle quelle

      return {
        ...data,
        email: user?.email
      } as Profile;
    },
  });

  const { data: permissions = [] } = useQuery<PagePermission[]>({
    queryKey: ["pagePermissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*");

      if (error) throw error;
      
      return data.map(permission => ({
        ...permission,
        feature_permissions: permission.feature_permissions as PagePermission['feature_permissions'] || {}
      }));
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      if (error) throw error;
      return data;
    }
  });

  const canAccessPage = (pagePath: string): boolean => {
    if (!profile || !permissions) return false;
    if (isAdmin) return true;

    // Add debugging for the path being checked
    console.log("Checking access for path:", pagePath);

    // Special case for retailer detail pages
    if (pagePath.startsWith('/expenses/retailer/')) {
      console.log("Retailer detail page detected, checking expenses permissions");
      // If user can access /expenses, they can access all retailer detail pages
      return canAccessPage('/expenses');
    }

    // Special case for vehicle detail pages
    if (pagePath.startsWith('/vehicles/')) {
      console.log("Vehicle detail page detected, checking vehicles permissions");
      // If user can access /vehicles, they can access all vehicle detail pages
      return canAccessPage('/vehicles');
    }

    const pagePermission = permissions.find(p => p.page_path === pagePath);
    if (!pagePermission) {
      console.log("No permission found for path:", pagePath);
      return false; // Si aucune permission n'est définie, on refuse l'accès
    }

    const hasAccess = pagePermission.required_profile === 'basic' || 
           (pagePermission.required_profile === 'pro' && profile.profile_type === 'pro');
    
    console.log("Permission result:", hasAccess, "Required profile:", pagePermission.required_profile, "User profile:", profile.profile_type);
    return hasAccess;
  };

  const canAccessFeature = (pagePath: string, featureKey: string): boolean => {
    if (!profile || !permissions) return false;
    if (isAdmin) return true;
    
    // Pour les projets d'épargne, autoriser l'accès à tous les utilisateurs
    if (pagePath === '/savings' && featureKey === 'savings_projects') {
      return true;
    }
    
    // Pour les autres fonctionnalités
    const pagePermission = permissions.find(p => p.page_path === pagePath);
    if (!pagePermission) return false; // Si aucune permission n'est définie, on refuse l'accès

    const featurePermission = pagePermission.feature_permissions?.[featureKey];
    if (!featurePermission) return true; // Si aucune permission spécifique n'est définie, on autorise par défaut
 
    return featurePermission.required_profile === 'basic' ||
           (featurePermission.required_profile === 'pro' && profile.profile_type === 'pro');
  };

  return {
    profile,
    permissions,
    isAdmin,
    canAccessPage,
    canAccessFeature
  };
};
