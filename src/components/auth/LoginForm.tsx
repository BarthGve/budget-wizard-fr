
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitCount, setSubmitCount] = useState(0); // Pour éviter les doubles soumissions
  
  const { login, loading: authLoading } = useAuthContext();

  // Si le contexte d'authentification est en chargement, on le reflète aussi dans le formulaire
  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
    }
  }, [authLoading]);

  const formSchema = z.object({
    email: z.string().email({ message: "Adresse email invalide" }),
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Protection contre les soumissions multiples
    if (isLoading) return;
    
    setFormError(null);
    setIsLoading(true);
    
    // Incrémenter le compteur de soumission
    const currentSubmit = submitCount + 1;
    setSubmitCount(currentSubmit);
    
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      
      // Si on est toujours sur la page après 5 secondes, essayer de rediriger manuellement
      setTimeout(() => {
        if (location.pathname === "/login" && currentSubmit === submitCount) {
          console.log("Redirection manuelle après délai");
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }
      }, 5000);
    } catch (error: any) {
      setFormError(error.message || "Erreur lors de la connexion");
      setIsLoading(false);
    }
  };

  return (
    <>
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            {...form.register("email")}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <a 
              href="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>
    </>
  );
};
