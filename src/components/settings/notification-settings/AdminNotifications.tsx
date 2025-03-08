
import { NotificationToggle } from "./NotificationToggle";

interface AdminNotificationsProps {
  isSignupNotificationEnabled: boolean;
  isFeedbackNotificationEnabled: boolean;
  isUpdating: boolean;
  onSignupToggle: (enabled: boolean) => void;
  onFeedbackToggle: (enabled: boolean) => void;
}

export const AdminNotifications = ({
  isSignupNotificationEnabled,
  isFeedbackNotificationEnabled,
  isUpdating,
  onSignupToggle,
  onFeedbackToggle
}: AdminNotificationsProps) => {
  return (
    <>
      {/* Notifications d'inscription */}
      <NotificationToggle
        label="Notifications d'inscription"
        description="Email de notification pour chaque nouvelle inscription"
        tooltipContent="Recevez un email lorsqu'un nouvel utilisateur s'inscrit"
        checked={isSignupNotificationEnabled}
        onCheckedChange={onSignupToggle}
        disabled={isUpdating}
      />

      {/* Notifications de feedback */}
      <NotificationToggle
        label="Notifications de feedback"
        description="Email de notification pour chaque nouveau feedback"
        tooltipContent="Recevez un email lorsqu'un utilisateur soumet un nouveau feedback"
        checked={isFeedbackNotificationEnabled}
        onCheckedChange={onFeedbackToggle}
        disabled={isUpdating}
      />
    </>
  );
};
