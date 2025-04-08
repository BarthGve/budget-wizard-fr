
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
import { LoadingButton } from "@/components/ui/loading-button";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  const { login, loading: authLoading, isAuthenticated } = useAuthContext();

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && !submitAttempted) {
      console.log("Déjà authentifié, redirection vers dashboard");
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, submitAttempted]);

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
    // Éviter les soumissions multiples
    if (authLoading) return;
    
    setFormError(null);
    setSubmitAttempted(true);
    
    try {
      console.log("Tentative de connexion...");
      
      await login({
        email: values.email,
        password: values.password,
      });
      
      // Login gère déjà la redirection
    } catch (error: any) {
      console.error("Erreur dans le formulaire:", error);
      setFormError(error.message || "Erreur lors de la connexion");
      setSubmitAttempted(false);
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
            disabled={authLoading}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
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
            disabled={authLoading}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <LoadingButton type="submit" className="w-full" loading={authLoading} disabled={authLoading}>
          Se connecter
        </LoadingButton>
      </form>
    </>
  );
};
