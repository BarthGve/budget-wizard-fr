
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthContext } from "@/context/AuthProvider";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { validatePasswordStrength, validateAndSanitizeInput, validateEmail, loginRateLimiter, getRateLimitIdentifier } from "@/utils/security";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  
  const { register: registerUser } = useAuthContext();

  const formSchema = z.object({
    name: z.string()
      .min(1, "Le prénom est obligatoire")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères")
      .refine((val) => validateAndSanitizeInput(val) === val, "Le prénom contient des caractères non autorisés"),
    email: z.string()
      .email("Adresse email invalide")
      .max(254, "L'email ne peut pas dépasser 254 caractères")
      .refine((val) => validateEmail(val), "Format d'email invalide"),
    password: z.string()
      .refine((val) => validatePasswordStrength(val).isValid, "Le mot de passe ne respecte pas les critères de sécurité"),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est obligatoire"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Éviter les soumissions multiples
    if (isLoading || isSubmitted) {
      return;
    }

    // Vérifier la limite de taux
    const rateLimitId = getRateLimitIdentifier();
    if (!loginRateLimiter.isAllowed(rateLimitId)) {
      const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(rateLimitId) / 1000 / 60);
      setFormError(`Trop de tentatives. Veuillez réessayer dans ${remainingTime} minutes.`);
      return;
    }
    
    setFormError(null);
    setIsLoading(true);
    setIsSubmitted(true);
    
    try {
      // Sanitiser les entrées
      const sanitizedName = validateAndSanitizeInput(values.name, 50);
      const sanitizedEmail = values.email.toLowerCase().trim();
      
      await registerUser({
        name: sanitizedName,
        email: sanitizedEmail,
        password: values.password,
      });
      
      navigate("/email-verification");
    } catch (error: any) {
      setFormError(error.message || "Erreur lors de l'inscription");
      setIsSubmitted(false);
    } finally {
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
          <Label htmlFor="name">Prénom</Label>
          <Input 
            id="name" 
            placeholder="Votre prénom"
            {...form.register("name")}
            disabled={isLoading || isSubmitted}
            maxLength={50}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="vous@exemple.com"
            {...form.register("email")}
            disabled={isLoading || isSubmitted}
            maxLength={254}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input 
            id="password" 
            type="password"
            {...form.register("password", {
              onChange: (e) => setPassword(e.target.value)
            })}
            disabled={isLoading || isSubmitted}
          />
          <PasswordStrengthMeter password={password} />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input 
            id="confirmPassword" 
            type="password"
            {...form.register("confirmPassword")}
            disabled={isLoading || isSubmitted}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        
        <LoadingButton type="submit" className="w-full" loading={isLoading} disabled={isLoading || isSubmitted}>
          S'inscrire
        </LoadingButton>
      </form>
    </>
  );
};
