
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type") || "changelog";
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de désinscription invalide ou manquant");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("unsubscribe", {
          body: { token, type }
        });

        if (error) {
          console.error("Erreur lors de la désinscription:", error);
          setStatus("error");
          setMessage(error.message || "Une erreur est survenue lors de la désinscription");
          return;
        }

        setStatus("success");
        setMessage("Vous avez été désinscrit avec succès des notifications");
      } catch (error: any) {
        console.error("Erreur:", error);
        setStatus("error");
        setMessage(error.message || "Une erreur est survenue");
      }
    };

    handleUnsubscribe();
  }, [token, type]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Désinscription</CardTitle>
          <CardDescription>
            Gestion de vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p className="text-center text-muted-foreground">
                Traitement de votre demande en cours...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center font-medium">{message}</p>
              <p className="text-center text-muted-foreground mt-2">
                Vous ne recevrez plus de notifications concernant les mises à jour de l'application.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-center font-medium">Erreur</p>
              <p className="text-center text-muted-foreground mt-2">{message}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unsubscribe;
