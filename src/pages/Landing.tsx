import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
const Landing = () => {
  return <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Budget Wizard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gérez vos dépenses en groupe facilement. Suivez les contributions, partagez les coûts et gardez une vue claire sur vos finances partagées.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Connectez-vous</CardTitle>
              <CardDescription>
                Accédez à votre tableau de bord pour gérer vos budgets partagés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full" size="lg">
                  <LogIn className="mr-2" />
                  Se connecter
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Créez un compte</CardTitle>
              <CardDescription>
                Commencez à gérer vos dépenses partagées dès maintenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/register">
                <Button className="w-full" size="lg" variant="outline">
                  <UserPlus className="mr-2" />
                  S'inscrire
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">Suivi des dépenses</h3>
              <p className="text-muted-foreground">
                Gardez une trace claire de toutes les dépenses partagées
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Gestion des contributeurs</h3>
              <p className="text-muted-foreground">
                Ajoutez et gérez facilement les participants au budget
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Dépenses récurrentes</h3>
              <p className="text-muted-foreground">
                Suivez et gérez vos charges mensuelles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Landing;