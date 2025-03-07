
import { NotificationCard } from "./NotificationCard";
import { ChangelogNotification } from "./ChangelogNotification";
import { AdminNotifications } from "./AdminNotifications";
import { useNotificationSettings } from "./useNotificationSettings";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const NotificationSettings = () => {
  const { isAdmin, profile } = usePagePermissions();
  const {
    isSignupNotificationEnabled,
    isChangelogNotificationEnabled,
    isFeedbackNotificationEnabled,
    isUpdating,
    handleSignupNotificationToggle,
    handleChangelogNotificationToggle,
    handleFeedbackNotificationToggle
  } = useNotificationSettings(profile);

  return (
    <NotificationCard>
      {/* Notifications de changelog pour tous les utilisateurs */}
      <ChangelogNotification
        isChangelogNotificationEnabled={isChangelogNotificationEnabled}
        isUpdating={isUpdating}
        onChangelogToggle={handleChangelogNotificationToggle}
      />

      {/* Notifications exclusives pour les administrateurs */}
      {isAdmin && (
        <AdminNotifications
          isSignupNotificationEnabled={isSignupNotificationEnabled}
          isFeedbackNotificationEnabled={isFeedbackNotificationEnabled}
          isUpdating={isUpdating}
          onSignupToggle={handleSignupNotificationToggle}
          onFeedbackToggle={handleFeedbackNotificationToggle}
        />
      )}
    </NotificationCard>
  );
};
