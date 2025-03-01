
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { KeyRound, ShieldAlert } from "lucide-react";
import { EncryptionSettings } from "./EncryptionSettings";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sécurité</h2>
        <p className="text-muted-foreground">
          Gérez vos informations de sécurité et vos préférences de confidentialité.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <KeyRound className="h-6 w-6 text-primary" />
            <CardTitle>Mot de passe</CardTitle>
          </div>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input type="password" id="current-password" placeholder="********" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input type="password" id="new-password" placeholder="********" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirmez le nouveau mot de passe</Label>
            <Input type="password" id="confirm-new-password" placeholder="********" />
          </div>
          <Button className="mt-2" variant="outline">
            Mettre à jour le mot de passe
          </Button>
        </CardContent>
      </Card>

      <EncryptionSettings />

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            <CardTitle>Zone de danger</CardTitle>
          </div>
          <CardDescription>
            Actions sensibles qui nécessitent une attention particulière
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              La suppression de votre compte est permanente et irréversible.
              Toutes vos données personnelles et vos préférences seront supprimées.
            </p>
            <Button variant="destructive">Supprimer mon compte</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
