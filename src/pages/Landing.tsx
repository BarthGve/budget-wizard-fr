import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Wallet, Users, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <img 
            src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png"
            alt="Budget Wizard Logo"
            className="w-48 h-48 md:w-64 md:h-64 animate-fade-up"
          />
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              La magie de la gestion budgétaire
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Simplifiez la gestion de vos dépenses en groupe. Suivez vos contributions, 
              partagez les coûts et gardez le contrôle de vos finances partagées.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mt-8">
            <Link to="/login" className="flex-1">
              <Button className="w-full group" size="lg">
                <LogIn className="mr-2 group-hover:translate-x-1 transition-transform" />
                Se connecter
              </Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button variant="outline" className="w-full group" size="lg">
                <UserPlus className="mr-2 group-hover:scale-110 transition-transform" />
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="group p-6 rounded-2xl bg-card hover:bg-primary/5 transition-colors border">
            <Wallet className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Suivi des dépenses</h3>
            <p className="text-muted-foreground">
              Gardez une vue claire et précise de toutes vos dépenses partagées en temps réel
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-card hover:bg-primary/5 transition-colors border">
            <Users className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Gestion des contributeurs</h3>
            <p className="text-muted-foreground">
              Ajoutez et gérez facilement les participants avec une interface intuitive
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-card hover:bg-primary/5 transition-colors border">
            <Clock className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Dépenses récurrentes</h3>
            <p className="text-muted-foreground">
              Automatisez le suivi de vos charges mensuelles pour plus de tranquillité
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-card hover:bg-primary/5 transition-colors border">
            <Target className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Objectifs d'épargne</h3>
            <p className="text-muted-foreground">
              Fixez et suivez vos objectifs d'épargne en toute simplicité avec des outils visuels intuitifs
            </p>
          </div>
        </div>

        {/* Security Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Sécurité maximale</h3>
                <p className="text-muted-foreground">
                  Vos données financières sont protégées avec les plus hauts standards de sécurité
                </p>
              </div>
            </div>
            <Link to="/register">
              <Button size="lg" className="shadow-lg">
                Commencer gratuitement
                <UserPlus className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
