
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RegisterFormData, validateRegisterForm } from "@/utils/formValidation";
import { registerUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RegisterFormProps {
  onSubmit?: () => void;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Réinitialiser le message d'erreur lorsque l'utilisateur modifie quelque chose
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Tentative d'inscription depuis le formulaire...");
      
      // Tentative d'inscription avec plusieurs essais si nécessaire
      let retryCount = 0;
      const maxRetries = 2;
      let lastError = null;
      
      while (retryCount <= maxRetries) {
        try {
          await registerUser({
            email: formData.email,
            password: formData.password,
            name: formData.name
          });
          
          console.log("Inscription réussie après " + retryCount + " essais!");
          toast.success("Inscription réussie! Veuillez vérifier votre email.");
          
          if (onSubmit) {
            onSubmit();
          }
          
          navigate("/email-verification");
          return; // Sortir de la fonction si l'inscription a réussi
        } catch (err: any) {
          lastError = err;
          
          // Ne pas réessayer si c'est une erreur d'email déjà existant ou autre erreur non technique
          if (!err.message.includes("Problème technique")) {
            break;
          }
          
          console.log(`Tentative ${retryCount + 1} échouée, nouvelle tentative...`);
          retryCount++;
          // Attendre un peu avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Si on arrive ici, toutes les tentatives ont échoué
      throw lastError;
    } catch (error: any) {
      console.error("Erreur finale capturée dans le formulaire d'inscription:", error);
      
      // Message d'erreur plus compréhensible pour l'utilisateur
      if (error.message.includes("Database error") || 
          error.message.includes("stack depth") ||
          error.message.includes("column \"tg_depth\"") ||
          error.message.includes("Problème technique")) {
        setError("Problème technique lors de l'inscription. Veuillez réessayer dans quelques instants ou contacter le support.");
      } else if (error.message.includes("User already registered") || error.message.includes("existe déjà")) {
        setError("Un compte existe déjà avec cet email. Veuillez vous connecter ou utiliser une autre adresse email.");
      } else {
        setError(error.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input 
            id="name" 
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="vous@exemple.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input 
            id="password" 
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input 
            id="confirmPassword" 
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
    </>
  );
};
