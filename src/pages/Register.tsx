
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    try {
      // Tentative d'inscription avec un appel simple et direct
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Gestion détaillée des erreurs spécifiques
        if (error.message.includes("User already registered")) {
          toast.error("Un compte existe déjà avec cet email");
        } else if (error.message.includes("Password should be at least")) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères");
        } else if (error.message.includes("invalid email")) {
          toast.error("L'adresse email n'est pas valide");
        } else {
          toast.error("Erreur lors de l'inscription: " + error.message);
        }
      } else if (data && data.user) {
        // Stockage de l'email pour la page de vérification
        localStorage.setItem("verificationEmail", formData.email);
        toast.success("Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.");
        navigate("/email-verification");
      }
    } catch (error: any) {
      console.error("Unexpected error during registration:", error);
      toast.error("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input 
                id="name" 
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                required
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
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
