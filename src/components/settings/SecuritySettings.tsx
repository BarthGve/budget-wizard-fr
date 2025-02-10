
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <CardTitle>Sécurité</CardTitle>
        </div>
        <CardDescription>Gérez vos paramètres de sécurité et mot de passe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input id="current-password" type="password" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
