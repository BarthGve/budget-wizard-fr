
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const NotificationSettings = () => {
  const { currentUser } = useCurrentUser();
  const { isAdmin, profile } = usePagePermissions();
  const queryClient = useQueryClient();
  const [isSignupNotificationEnabled, setIsSignupNotificationEnabled] = useState<boolean>(
    profile?.notif_inscriptions !== false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSignupNotificationToggle = async (enabled: boolean) => {
    if (!currentUser || !isAdmin) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notif_inscriptions: enabled })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setIsSignupNotificationEnabled(enabled);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      toast.success(
        enabled 
          ? "Notifications d'inscription activées" 
          : "Notifications d'inscription désactivées"
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des préférences de notification:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setIsUpdating(false);
    }
  };

  // Si l'utilisateur n'est pas admin, ne pas afficher cette section
  if (!isAdmin) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>Configurez vos préférences de notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label>Notifications d'inscription</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Recevez un email lorsqu'un nouvel utilisateur s'inscrit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">
              Email de notification pour chaque nouvelle inscription
            </p>
          </div>
          <Switch 
            checked={isSignupNotificationEnabled}
            onCheckedChange={handleSignupNotificationToggle}
            disabled={isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
};
