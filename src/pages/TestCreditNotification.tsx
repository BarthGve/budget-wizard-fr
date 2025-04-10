
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TestCreditNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const triggerNotification = async () => {
    setIsLoading(true);
    try {
      // Appel direct à la fonction edge de notification des crédits
      const { data, error } = await supabase.functions.invoke('notify-credits-monthly', {
        method: 'POST',
        body: {}
      });

      if (error) {
        throw error;
      }

      setResult(data);
      toast.success("Notifications de crédits envoyées avec succès");
    } catch (error: any) {
      console.error("Erreur lors de l'envoi des notifications:", error);
      toast.error(`Erreur: ${error.message || "Échec de l'envoi des notifications"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Test des notifications de crédits</CardTitle>
          <CardDescription>
            Cliquez sur le bouton ci-dessous pour déclencher manuellement l'envoi des notifications
            pour les crédits arrivant à échéance ce mois-ci.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={triggerNotification} 
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer les notifications maintenant"}
          </Button>

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Résultat :</h3>
              <pre className="p-4 bg-gray-100 rounded overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestCreditNotification;
