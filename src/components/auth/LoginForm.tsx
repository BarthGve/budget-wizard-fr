
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/auth";

interface LoginFormProps {
  onSubmit?: () => void;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await loginUser({ email, password });
      
      if (onSubmit) {
        onSubmit();
      }
      
      // Rediriger vers la route principale "/" au lieu de "/dashboard"
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      setError(error.message || "Une erreur est survenue lors de la connexion");
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
