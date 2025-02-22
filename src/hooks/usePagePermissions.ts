
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

      return {
        ...data,
        email: user?.email
      } as Profile;
    },
  });

  const { data: permissions } = useQuery<PagePermission[]>({
    queryKey: ["pagePermissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*");

      if (error) throw error;
      return data;
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

    const pagePermission = permissions.find(p => p.page_path === pagePath);
    if (!pagePermission) return false;

    return pagePermission.required_profile === 'basic' || 
           (pagePermission.required_profile === 'pro' && profile.profile_type === 'pro');
  };

  const canAccessFeature = (pagePath: string, featureKey: string): boolean => {
    if (!profile || !permissions) return false;
    if (isAdmin) return true;

    const pagePermission = permissions.find(p => p.page_path === pagePath);
    if (!pagePermission) return false;

    const featurePermission = pagePermission.feature_permissions?.[featureKey];
    if (!featurePermission) return true; // If no specific permission is set, allow access

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
