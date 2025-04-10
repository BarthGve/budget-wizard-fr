
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Check, FileWarning, Loader2 } from "lucide-react";

/**
 * Page de test pour exécuter manuellement la notification de crédits
 * Cette page est réservée aux administrateurs
 */
const TestCreditNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerCreditNotification = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Appel de la fonction edge
      const { data, error } = await supabase.functions.invoke("notify-credits-monthly", {
        body: {},
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Résultat de la notification:", data);
      setResult(data);
      
      // Afficher un toast de succès
      toast.success("Notification de crédits exécutée avec succès");
    } catch (err: any) {
      console.error("Erreur lors de l'exécution de la notification:", err);
      setError(err.message || "Une erreur s'est produite");
      
      // Afficher un toast d'erreur
      toast.error("Erreur lors de l'exécution de la notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Test de Notification de Crédits</CardTitle>
          <CardDescription>
            Cette page permet d'exécuter manuellement la fonction de notification 
            des crédits arrivant à échéance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Cette fonction envoie un email aux utilisateurs qui ont activé la notification de crédits
                et qui ont des crédits arrivant à échéance ce mois-ci.
              </p>
              
              <Button 
                onClick={triggerCreditNotification} 
                disabled={isLoading}
                className="w-fit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Exécuter la notification maintenant"
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-md flex gap-3 items-start dark:bg-red-950/30 dark:border-red-900">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-700 dark:text-red-400">Erreur d'exécution</h3>
                  <p className="text-red-600 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-md dark:bg-green-950/30 dark:border-green-900">
                <div className="flex gap-3 items-start mb-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-700 dark:text-green-400">Exécution réussie</h3>
                    <p className="text-green-600 dark:text-green-300">
                      {result.message || "La notification a été exécutée avec succès"}
                    </p>
                  </div>
                </div>
                
                {result.results && (
                  <div className="mt-4 border border-gray-200 rounded-md overflow-hidden dark:border-gray-700">
                    <div className="p-3 bg-gray-100 font-medium text-sm dark:bg-gray-800">
                      Résultats détaillés
                    </div>
                    <pre className="p-3 text-xs overflow-auto max-h-64 bg-gray-50 dark:bg-gray-900">
                      {JSON.stringify(result.results, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <FileWarning className="w-4 h-4" />
              <span>Conseil: Vérifiez les logs de la fonction dans la console Supabase pour plus de détails.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestCreditNotification;
