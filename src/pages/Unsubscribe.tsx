
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const unsubscribe = async () => {
      if (!token || !type) {
        setStatus("error");
        setMessage("Lien de désinscription invalide. Le token ou le type de notification est manquant.");
        return;
      }
      
      try {
        const { data, error } = await supabase.functions.invoke("unsubscribe", {
          body: { token, type }
        });
        
        if (error) {
          console.error("Erreur lors de la désinscription:", error);
          setStatus("error");
          setMessage("Une erreur est survenue lors de la désinscription. Veuillez réessayer plus tard.");
          return;
        }
        
        if (data?.success) {
          setStatus("success");
          setMessage("Vous avez été désinscrit avec succès des notifications.");
        } else {
          setStatus("error");
          setMessage(data?.error || "Une erreur est survenue lors de la désinscription.");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setStatus("error");
        setMessage("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
      }
    };
    
    unsubscribe();
  }, [token, type]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            {status === "loading" && (
              <div className="animate-pulse mb-4 text-primary">
                <AlertTriangle className="h-12 w-12" />
              </div>
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
            )}
            
            <CardTitle>
              {status === "loading" ? "Traitement de votre demande..." : 
               status === "success" ? "Désinscription réussie" : 
               "Erreur de désinscription"}
            </CardTitle>
            
            <CardDescription className="mt-2">
              {status === "loading" ? "Veuillez patienter pendant que nous traitons votre demande..." : message}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="text-center">
          {status !== "loading" && (
            <p className="text-sm text-muted-foreground">
              {status === "success" 
                ? "Vous ne recevrez plus de notifications concernant les mises à jour de BudgetWizard." 
                : "Vous pouvez également gérer vos préférences de notification depuis votre profil."}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Link to="/">
            <Button className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unsubscribe;
