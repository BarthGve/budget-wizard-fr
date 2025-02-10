
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wallet } from "lucide-react";

export const PaymentSettings = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5" />
          <CardTitle>Préférences de paiement</CardTitle>
        </div>
        <CardDescription>Gérez vos méthodes de paiement et préférences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Devise par défaut</Label>
          <div className="flex items-center space-x-2">
            <Input value="EUR" readOnly className="w-24" />
            <span className="text-sm text-muted-foreground">
              La devise ne peut pas être modifiée pour le moment
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications de paiement</Label>
            <p className="text-sm text-muted-foreground">
              Recevez des alertes pour les paiements programmés
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};
