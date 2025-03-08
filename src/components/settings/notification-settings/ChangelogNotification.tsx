
import { NotificationToggle } from "./NotificationToggle";

interface ChangelogNotificationProps {
  isChangelogNotificationEnabled: boolean;
  isUpdating: boolean;
  onChangelogToggle: (enabled: boolean) => void;
}

export const ChangelogNotification = ({
  isChangelogNotificationEnabled,
  isUpdating,
  onChangelogToggle
}: ChangelogNotificationProps) => {
  return (
    <NotificationToggle
      id="notif_changelog" // Ajout de l'ID requis
      label="Notifications des nouveautés"
      description="Email de notification pour chaque mise à jour de l'application"
      tooltipContent="Recevez un email lorsque de nouvelles fonctionnalités sont ajoutées"
      checked={isChangelogNotificationEnabled}
      onCheckedChange={onChangelogToggle}
      disabled={isUpdating}
    />
  );
};
