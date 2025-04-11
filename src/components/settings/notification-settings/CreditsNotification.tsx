
import { NotificationToggle } from "./NotificationToggle";

interface CreditsNotificationProps {
  isCreditsNotificationEnabled: boolean;
  isUpdating: boolean;
  onCreditsToggle: (enabled: boolean) => void;
}

export const CreditsNotification = ({
  isCreditsNotificationEnabled,
  isUpdating,
  onCreditsToggle
}: CreditsNotificationProps) => {
  return (
    <NotificationToggle
      label="Notifications de crédits"
      description="Email mensuel pour les crédits arrivant à échéance"
      tooltipContent="Recevez un email au début de chaque mois listant vos crédits arrivant à échéance"
      checked={isCreditsNotificationEnabled}
      onCheckedChange={onCreditsToggle}
      disabled={isUpdating}
    />
  );
};
