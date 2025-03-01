
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    setError(null);
    
    if (!formData.name.trim()) {
      setError("Le nom est obligatoire");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("L'email est obligatoire");
      return false;
    }
    
    if (!formData.password) {
      setError("Le mot de passe est obligatoire");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Tentative d'inscription avec:", { email: formData.email, name: formData.name });
      
      // Simplify the signup process to avoid trigger recursion
      // First create the user without metadata to avoid triggering complex chains
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Explicitly set empty data to minimize potential trigger issues
          data: { }
        }
      });

      console.log("Réponse d'inscription:", { data, error: signUpError ? signUpError.message : null });

      if (signUpError) {
        console.error("Erreur détaillée:", signUpError);
        
        // Gestion des erreurs spécifiques
        if (signUpError.message.includes("User already registered")) {
          setError("Un compte existe déjà avec cet email");
        } else if (signUpError.message.includes("Database error")) {
          setError("Erreur de connexion à la base de données. Veuillez contacter l'administrateur.");
          console.error("Erreur supabase détectée:", signUpError);
        } else {
          setError(`Erreur d'inscription: ${signUpError.message}`);
        }
        return;
      }
      
      if (data && data.user) {
        // Rather than updating immediately, delay the metadata update
        console.log("Utilisateur créé avec succès, redirection...");
        
        // Store email to allow verification
        localStorage.setItem("verificationEmail", formData.email);
        
        // Store name to update later
        localStorage.setItem("userName", formData.name);
        
        toast.success("Inscription réussie! Veuillez vérifier votre email.");
        navigate("/email-verification");
      } else {
        setError("Réponse inattendue du serveur. Veuillez réessayer.");
      }
    } catch (error: any) {
      console.error("Erreur technique inattendue:", error);
      setError("Une erreur technique est survenue. Veuillez réessayer ultérieurement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Créez votre compte pour commencer à gérer vos budgets partagés
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
