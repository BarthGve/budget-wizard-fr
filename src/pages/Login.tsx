
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre tableau de bord
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="vous@exemple.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Inscrivez-vous
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
