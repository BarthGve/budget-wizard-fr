
import { NotificationToggle } from "./NotificationToggle";
import { Profile } from "@/types/profile";

interface AdminNotificationsProps {
  profile: Profile;
  isUpdating: boolean;
  updateNotificationSettings: (setting: string, value: boolean) => void;
}

export const AdminNotifications = ({
  profile,
  isUpdating,
  updateNotificationSettings
}: AdminNotificationsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notifications administrateur</h3>
      
      {/* Notifications d'inscription */}
      <NotificationToggle
        id="notif_inscriptions"
        label="Notifications d'inscription"
        description="Email de notification pour chaque nouvelle inscription"
        checked={profile.notif_inscriptions}
        onCheckedChange={(checked) => updateNotificationSettings('notif_inscriptions', checked)}
        disabled={isUpdating}
      />

      {/* Notifications de feedback */}
      <NotificationToggle
        id="notif_feedbacks"
        label="Notifications de feedback"
        description="Email de notification pour chaque nouveau feedback"
        checked={profile.notif_feedbacks}
        onCheckedChange={(checked) => updateNotificationSettings('notif_feedbacks', checked)}
        disabled={isUpdating}
      />
    </div>
  );
};
