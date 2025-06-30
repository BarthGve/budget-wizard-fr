
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const useNotificationSettings = (profile?: Profile | null) => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [isSignupNotificationEnabled, setIsSignupNotificationEnabled] = useState<boolean>(
    profile?.notif_inscriptions !== false
  );
  const [isChangelogNotificationEnabled, setIsChangelogNotificationEnabled] = useState<boolean>(
    profile?.notif_changelog !== false
  );
  const [isFeedbackNotificationEnabled, setIsFeedbackNotificationEnabled] = useState<boolean>(
    profile?.notif_feedbacks !== false
  );
  const [isCreditsNotificationEnabled, setIsCreditsNotificationEnabled] = useState<boolean>(
    profile?.notif_credits !== false
  );
  const [isExpensesNotificationEnabled, setIsExpensesNotificationEnabled] = useState<boolean>(
    profile?.notif_expenses !== false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const updateNotificationSetting = async (
    settingName: 'notif_inscriptions' | 'notif_changelog' | 'notif_feedbacks' | 'notif_credits' | 'notif_expenses',
    enabled: boolean, 
    successMessage: { enabled: string, disabled: string },
    setStateFn: (enabled: boolean) => void
  ) => {
    if (!currentUser) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [settingName]: enabled })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setStateFn(enabled);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      toast.success(enabled ? successMessage.enabled : successMessage.disabled);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des préférences de notification:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignupNotificationToggle = async (enabled: boolean) => {
    await updateNotificationSetting(
      'notif_inscriptions',
      enabled,
      {
        enabled: "Notifications d'inscription activées",
        disabled: "Notifications d'inscription désactivées"
      },
      setIsSignupNotificationEnabled
    );
  };

  const handleChangelogNotificationToggle = async (enabled: boolean) => {
    await updateNotificationSetting(
      'notif_changelog',
      enabled,
      {
        enabled: "Notifications des nouveautés activées",
        disabled: "Notifications des nouveautés désactivées"
      },
      setIsChangelogNotificationEnabled
    );
  };

  const handleFeedbackNotificationToggle = async (enabled: boolean) => {
    await updateNotificationSetting(
      'notif_feedbacks',
      enabled,
      {
        enabled: "Notifications de feedback activées",
        disabled: "Notifications de feedback désactivées"
      },
      setIsFeedbackNotificationEnabled
    );
  };

  const handleCreditsNotificationToggle = async (enabled: boolean) => {
    await updateNotificationSetting(
      'notif_credits',
      enabled,
      {
        enabled: "Notifications de crédits activées",
        disabled: "Notifications de crédits désactivées"
      },
      setIsCreditsNotificationEnabled
    );
  };

  const handleExpensesNotificationToggle = async (enabled: boolean) => {
    await updateNotificationSetting(
      'notif_expenses',
      enabled,
      {
        enabled: "Notifications de dépenses activées",
        disabled: "Notifications de dépenses désactivées"
      },
      setIsExpensesNotificationEnabled
    );
  };

  return {
    isSignupNotificationEnabled,
    isChangelogNotificationEnabled,
    isFeedbackNotificationEnabled,
    isCreditsNotificationEnabled,
    isExpensesNotificationEnabled,
    isUpdating,
    handleSignupNotificationToggle,
    handleChangelogNotificationToggle,
    handleFeedbackNotificationToggle,
    handleCreditsNotificationToggle,
    handleExpensesNotificationToggle
  };
};
