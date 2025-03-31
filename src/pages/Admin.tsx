
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, FileText, MessageSquare, Shield, 
  PieChart, BarChart, Database, Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserStats } from "@/components/admin/UserStats";
import StyledLoader from "@/components/ui/StyledLoader";

const Admin = () => {
  const navigate = useNavigate();
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <StyledLoader/>;
  }

  // Liens rapides pour l'administration
  const adminLinks = [
    { 
      title: "Gestion utilisateurs", 
      icon: <Users className="h-5 w-5" />, 
      description: "Gérer les utilisateurs, leurs rôles et leurs profils",
      action: () => navigate("/admin/users")
    },
    { 
      title: "Feedbacks", 
      icon: <MessageSquare className="h-5 w-5" />, 
      description: "Consulter et gérer les retours utilisateurs",
      action: () => navigate("/admin/feedbacks")
    },
    { 
      title: "Changelog", 
      icon: <FileText className="h-5 w-5" />, 
      description: "Gérer et publier les mises à jour de l'application",
      action: () => navigate("/admin/changelog")
    },
    { 
      title: "Permissions", 
      icon: <Shield className="h-5 w-5" />, 
      description: "Gérer les permissions d'accès aux pages",
      action: () => {}
    },
  ];

  // Liens pour données et statistiques
  const dataLinks = [
    { 
      title: "Statistiques utilisateurs", 
      icon: <PieChart className="h-5 w-5" />, 
      description: "Visualiser les données démographiques des utilisateurs",
      action: () => {}
    },
    { 
      title: "Statistiques financières", 
      icon: <BarChart className="h-5 w-5" />, 
      description: "Analyser les données financières globales",
      action: () => {}
    },
    { 
      title: "Base de données", 
      icon: <Database className="h-5 w-5" />, 
      description: "Consulter et gérer la structure des données",
      action: () => {}
    },
    { 
      title: "Configuration", 
      icon: <Settings className="h-5 w-5" />, 
      description: "Paramètres globaux de l'application",
      action: () => {}
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tableau de bord administrateur</h1>
          <p className="text-lg text-muted-foreground">
            Bienvenue dans l'interface d'administration de BudgetWizard
          </p>
        </div>
        
        {/* Statistiques utilisateurs */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Statistiques utilisateurs</h2>
          <UserStats />
        </section>
        
        {/* Gestion administrative */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Gestion administrative</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {adminLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <div className="p-2 rounded-full bg-primary/10">
                      {link.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{link.description}</p>
                  <Button onClick={link.action} variant="default" size="sm" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Données et statistiques */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Données et statistiques</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {dataLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <div className="p-2 rounded-full bg-primary/10">
                      {link.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{link.description}</p>
                  <Button onClick={link.action} variant="outline" size="sm" className="w-full">
                    Consulter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
