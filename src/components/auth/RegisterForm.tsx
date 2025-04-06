
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
import { useAuthContext } from "@/hooks/useAuthContext";
import { LoadingButton } from "@/components/ui/loading-button";

interface RegisterFormProps {
  onSubmit?: () => void;
}

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register: registerUser } = useAuthContext();

  const formSchema = z.object({
    name: z.string().min(1, "Le prénom est obligatoire"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
    
    setFormError(null);
    setIsLoading(true);
    setIsSubmitted(true);
    
    try {
      await registerUser({
        full_name: values.name,
        email: values.email,
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="vous@exemple.com"
            {...form.register("email")}
            disabled={isLoading || isSubmitted}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input 
            id="password" 
            type="password"
            {...form.register("password")}
            disabled={isLoading || isSubmitted}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input 
            id="confirmPassword" 
            type="password"
            {...form.register("confirmPassword")}
            disabled={isLoading || isSubmitted}
          />
        </div>
        <LoadingButton type="submit" className="w-full" loading={isLoading} disabled={isLoading || isSubmitted}>
          S'inscrire
        </LoadingButton>
      </form>
    </>
  );
};
