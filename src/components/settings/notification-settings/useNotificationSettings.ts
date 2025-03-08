
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const useNotificationSettings = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

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
    profile: currentUser?.profile
  };
};
