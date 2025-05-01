
import { NotificationToggle } from "./NotificationToggle";

interface ExpensesNotificationProps {
  isExpensesNotificationEnabled: boolean;
  isUpdating: boolean;
  onExpensesToggle: (enabled: boolean) => void;
}

export const ExpensesNotification = ({
  isExpensesNotificationEnabled,
  isUpdating,
  onExpensesToggle
}: ExpensesNotificationProps) => {
  return (
    <NotificationToggle
      label="Notifications de dépenses"
      description="Email mensuel récapitulatif des dépenses par enseigne"
      tooltipContent="Recevez un email au début de chaque mois récapitulant vos dépenses du mois précédent par enseigne"
      checked={isExpensesNotificationEnabled}
      onCheckedChange={onExpensesToggle}
      disabled={isUpdating}
    />
  );
};
