
import { NotificationCard } from "./NotificationCard";
import { ChangelogNotification } from "./ChangelogNotification";
import { AdminNotifications } from "./AdminNotifications";
import { CreditsNotification } from "./CreditsNotification";
import { ExpensesNotification } from "./ExpensesNotification";
import { useNotificationSettings } from "./useNotificationSettings";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const NotificationSettings = () => {
  const { isAdmin, profile } = usePagePermissions();
  const {
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

      {/* Notifications de dépenses pour tous les utilisateurs */}
      <ExpensesNotification
        isExpensesNotificationEnabled={isExpensesNotificationEnabled}
        isUpdating={isUpdating}
        onExpensesToggle={handleExpensesNotificationToggle}
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
