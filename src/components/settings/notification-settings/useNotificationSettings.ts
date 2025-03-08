
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

export const useNotificationSettings = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // Récupérer le profil utilisateur séparément pour avoir accès aux préférences de notification
  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!currentUser) throw new Error("Utilisateur non connecté");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!currentUser,
  });

  const updateNotificationSettings = async (settingName: string, enabled: boolean) => {
    if (!currentUser) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [settingName]: enabled })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      const successMessage = enabled 
        ? `Notifications ${settingName.replace('notif_', '')} activées`
        : `Notifications ${settingName.replace('notif_', '')} désactivées`;
      
      toast.success(successMessage);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des préférences de notification:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateNotificationSettings,
    profile
  };
};
