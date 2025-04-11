
import { NotificationCard } from "./NotificationCard";
import { ChangelogNotification } from "./ChangelogNotification";
import { AdminNotifications } from "./AdminNotifications";
import { CreditsNotification } from "./CreditsNotification";
import { useNotificationSettings } from "./useNotificationSettings";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const NotificationSettings = () => {
  const { isAdmin, profile } = usePagePermissions();
  const {
    isSignupNotificationEnabled,
    isChangelogNotificationEnabled,
    isFeedbackNotificationEnabled,
    isCreditsNotificationEnabled,
    isUpdating,
    handleSignupNotificationToggle,
    handleChangelogNotificationToggle,
    handleFeedbackNotificationToggle,
    handleCreditsNotificationToggle
  } = useNotificationSettings(profile);

  return (
    <NotificationCard>
      {/* Notifications de changelog pour tous les utilisateurs */}
      <ChangelogNotification
        isChangelogNotificationEnabled={isChangelogNotificationEnabled}
        isUpdating={isUpdating}
        onChangelogToggle={handleChangelogNotificationToggle}
      />

      {/* Notifications de crédits pour tous les utilisateurs */}
      <CreditsNotification
        isCreditsNotificationEnabled={isCreditsNotificationEnabled}
        isUpdating={isUpdating}
        onCreditsToggle={handleCreditsNotificationToggle}
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
