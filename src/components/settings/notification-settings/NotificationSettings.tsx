
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useNotificationSettings } from "./useNotificationSettings";
import { AdminNotifications } from "./AdminNotifications";
import { NotificationToggle } from "./NotificationToggle";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const NotificationSettings = () => {
  const { currentUser } = useCurrentUser();
  const { isAdmin } = usePagePermissions();
  const { profile, updateNotificationSettings, isUpdating } = useNotificationSettings();

  if (!profile) {
    return <div>Chargement des paramètres de notification...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>Gérez vos préférences de notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications générales</h3>
          
          <NotificationToggle
            id="notif_changelog"
            label="Mises à jour de l'application"
            description="Recevez des notifications lorsque l'application est mise à jour avec de nouvelles fonctionnalités"
            checked={profile.notif_changelog}
            disabled={isUpdating}
            onCheckedChange={(checked) => updateNotificationSettings('notif_changelog', checked)}
          />
        </div>

        {isAdmin && (
          <AdminNotifications
            profile={profile}
            isUpdating={isUpdating}
            updateNotificationSettings={updateNotificationSettings}
          />
        )}

        <div className="rounded-md bg-blue-50 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">À propos des notifications</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Les notifications sont envoyées par email. Vous pouvez modifier vos préférences à tout moment.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
