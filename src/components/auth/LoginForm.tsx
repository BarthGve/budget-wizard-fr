
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
import { validateEmail, loginRateLimiter, getRateLimitIdentifier } from "@/utils/security";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const { login, loading: authLoading, isAuthenticated } = useAuthContext();

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && !submitAttempted) {
      console.log("Déjà authentifié, redirection vers dashboard");
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, submitAttempted]);

  // Gérer le décompte de limitation de taux
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1000) {
            setFormError(null);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const formSchema = z.object({
    email: z.string()
      .email({ message: "Adresse email invalide" })
      .max(254, "L'email ne peut pas dépasser 254 caractères")
      .refine((val) => validateEmail(val), "Format d'email invalide"),
    password: z.string().min(1, { message: "Le mot de passe est obligatoire" }),
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
    if (authLoading || remainingTime > 0) return;

    // Vérifier la limite de taux
    const rateLimitId = getRateLimitIdentifier();
    if (!loginRateLimiter.isAllowed(rateLimitId)) {
      const remaining = loginRateLimiter.getRemainingTime(rateLimitId);
      setRemainingTime(remaining);
      const minutes = Math.ceil(remaining / 1000 / 60);
      setFormError(`Trop de tentatives de connexion. Veuillez réessayer dans ${minutes} minute${minutes > 1 ? 's' : ''}.`);
      return;
    }
    
    setFormError(null);
    setSubmitAttempted(true);
    
    try {
      console.log("Tentative de connexion...");
      
      // Nettoyer et valider l'email
      const cleanEmail = values.email.toLowerCase().trim();
      
      await login({
        email: cleanEmail,
        password: values.password,
      });
      
      // Login gère déjà la redirection
    } catch (error: any) {
      console.error("Erreur dans le formulaire:", error);
      
      // Messages d'erreur génériques pour éviter l'énumération d'utilisateurs
      const genericMessage = "Email ou mot de passe incorrect";
      setFormError(genericMessage);
      setSubmitAttempted(false);
    }
  };

  const formatRemainingTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {formError}
            {remainingTime > 0 && (
              <div className="mt-2 font-mono">
                Temps restant: {formatRemainingTime(remainingTime)}
              </div>
            )}
          </AlertDescription>
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
            disabled={authLoading || remainingTime > 0}
            maxLength={254}
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
            disabled={authLoading || remainingTime > 0}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <LoadingButton 
          type="submit" 
          className="w-full" 
          loading={authLoading} 
          disabled={authLoading || remainingTime > 0}
        >
          {remainingTime > 0 ? `Veuillez patienter (${formatRemainingTime(remainingTime)})` : 'Se connecter'}
        </LoadingButton>
      </form>
    </>
  );
};
