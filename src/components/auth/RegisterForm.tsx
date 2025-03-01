
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
      await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      toast.success("Inscription réussie! Veuillez vérifier votre email.");
      
      if (onSubmit) {
        onSubmit();
      }
      
      navigate("/email-verification");
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      
      // Message d'erreur plus spécifique
      if (error.message.includes("Database error") || error.message.includes("stack depth")) {
        setError("Problème technique lors de l'inscription. Nos équipes ont été notifiées. Veuillez réessayer dans quelques instants.");
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
