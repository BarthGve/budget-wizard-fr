
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useEncryption } from "@/hooks/useEncryption";
import { Shield, ShieldAlert, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

export function EncryptionSettings() {
  const { isEncryptionEnabled, isLoading, activateEncryption } = useEncryption();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleToggleEncryption = async () => {
    if (isEncryptionEnabled) {
      toast.error("La désactivation du chiffrement n'est pas supportée pour le moment");
      return;
    }

    // Si le chiffrement n'est pas activé, demander confirmation
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // Si l'utilisateur a confirmé, activer le chiffrement
    try {
      await activateEncryption();
      setShowConfirmation(false);
    } catch (error) {
      console.error("Erreur lors de l'activation du chiffrement:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle>Chiffrement des données</CardTitle>
        </div>
        <CardDescription>
          Chiffrez vos données financières sensibles pour une sécurité accrue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="encryption-toggle">Activer le chiffrement</Label>
            <p className="text-sm text-muted-foreground">
              Les montants sensibles seront chiffrés dans la base de données
            </p>
          </div>
          <Switch
            id="encryption-toggle"
            checked={isEncryptionEnabled}
            onCheckedChange={handleToggleEncryption}
            disabled={isLoading || isEncryptionEnabled}
          />
        </div>

        {showConfirmation && !isEncryptionEnabled && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-800 dark:bg-yellow-950">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                  Confirmation requise
                </h4>
                <p className="mt-1 text-yellow-700 dark:text-yellow-400">
                  L'activation du chiffrement est irréversible. Toutes vos données financières existantes seront chiffrées.
                  Êtes-vous sûr de vouloir continuer?
                </p>
                <div className="mt-3 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={activateEncryption}
                    disabled={isLoading}
                  >
                    Confirmer l'activation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-start space-x-3">
            <LockKeyhole className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Ce qui est chiffré:</p>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Montants des contributions</li>
                <li>Plus de données seront ajoutées dans les futures mises à jour</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          {isEncryptionEnabled 
            ? "Le chiffrement est activé pour votre compte" 
            : "Le chiffrement n'est pas activé pour votre compte"}
        </p>
      </CardFooter>
    </Card>
  );
}
