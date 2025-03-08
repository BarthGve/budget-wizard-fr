
import { NotificationToggle } from "./NotificationToggle";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AdminNotifications = () => {
  const [isSignupNotificationEnabled, setIsSignupNotificationEnabled] = useState(false);
  const [isFeedbackNotificationEnabled, setIsFeedbackNotificationEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (type: string, checked: boolean) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [type]: checked })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      if (type === 'notif_signup') {
        setIsSignupNotificationEnabled(checked);
      } else if (type === 'notif_feedback') {
        setIsFeedbackNotificationEnabled(checked);
      }
      
      toast.success("Préférences de notification mises à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 mt-6 border-t pt-6">
      <h3 className="text-lg font-medium">Notifications d'administration</h3>
      
      <NotificationToggle
        label="Nouvelles inscriptions"
        description="Recevez des notifications lorsque de nouveaux utilisateurs s'inscrivent"
        checked={isSignupNotificationEnabled}
        disabled={isUpdating}
        onCheckedChange={(checked) => handleToggle('notif_signup', checked)}
      />
      
      <NotificationToggle
        label="Nouveaux feedbacks"
        description="Recevez des notifications lorsque des utilisateurs soumettent des feedbacks"
        checked={isFeedbackNotificationEnabled}
        disabled={isUpdating}
        onCheckedChange={(checked) => handleToggle('notif_feedback', checked)}
      />
    </div>
  );
};
