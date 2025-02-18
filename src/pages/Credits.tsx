
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Credit } from "@/components/credits/types";
import { CreditDialog } from "@/components/credits/CreditDialog";

const Credits = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: credits, isLoading } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }

      return data as Credit[];
    }
  });

  const totalMensualites = credits?.reduce((total, credit) => {
    if (credit.statut === 'actif') {
      return total + credit.montant_mensualite;
    }
    return total;
  }, 0) || 0;

  if (isLoading) {
    return <DashboardLayout>
      <div>Chargement...</div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crédits</h1>
            <p className="text-muted-foreground">
              Gérez vos crédits et leurs échéances
            </p>
          </div>
          <CreditDialog
            trigger={
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un crédit
              </Button>
            }
          />
        </div>

        {/* Carte récapitulative */}
        <Card className="bg-gradient-to-br from-violet-500 to-violet-600">
          <CardHeader>
            <CardTitle className="text-white">Total des mensualités actives</CardTitle>
            <CardDescription className="text-violet-100">
              Montant total dû pour le mois en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {totalMensualites.toLocaleString('fr-FR')} €
            </div>
            <div className="text-violet-100 mt-2">
              {credits?.filter(credit => credit.statut === 'actif').length || 0} crédit(s) actif(s)
            </div>
          </CardContent>
        </Card>

        {/* Liste des crédits */}
        <div className="grid gap-6">
          {credits?.map((credit, index) => (
            <Card key={credit.id} className="overflow-hidden border-0 shadow-md bg-white">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex items-center gap-4 p-6 md:w-1/3">
                  <div className="bg-violet-50 p-3 rounded-full">
                    {credit.logo_url ? (
                      <img
                        src={credit.logo_url}
                        alt={credit.nom_credit}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-violet-100 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{credit.nom_credit}</h3>
                    <p className="text-sm text-muted-foreground">{credit.nom_domaine}</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 md:bg-white">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Mensualité</span>
                    <span className="font-semibold text-lg">
                      {credit.montant_mensualite.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Dernière échéance</span>
                    <span className="font-semibold">
                      {new Date(credit.date_derniere_mensualite).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <span className={`inline-flex items-center ${
                      credit.statut === 'actif' 
                        ? 'text-green-600' 
                        : 'text-gray-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        credit.statut === 'actif' 
                          ? 'bg-green-600' 
                          : 'bg-gray-600'
                      }`} />
                      {credit.statut === 'actif' ? 'Actif' : 'Remboursé'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Credits;
