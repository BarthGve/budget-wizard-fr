
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";

export const PrivacySettings = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Confidentialité</CardTitle>
        </div>
        <CardDescription>Gérez vos paramètres de confidentialité</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Profil public</Label>
            <p className="text-sm text-muted-foreground">
              Permettre aux autres utilisateurs de voir votre profil
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Partage des statistiques</Label>
            <p className="text-sm text-muted-foreground">
              Partager vos statistiques de budget avec les contributeurs
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};
