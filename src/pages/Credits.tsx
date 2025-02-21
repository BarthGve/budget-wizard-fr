
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
import { CreditActions } from "@/components/credits/CreditActions";

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
    const today = new Date();
    const lastPaymentDate = new Date(credit.date_derniere_mensualite);
    const isInCurrentMonth = lastPaymentDate.getMonth() === today.getMonth() && 
                           lastPaymentDate.getFullYear() === today.getFullYear();
    
    if (credit.statut === 'actif' || isInCurrentMonth) {
      return total + credit.montant_mensualite;
    }
    return total;
  }, 0) || 0;

  const handleCreditDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["credits"] });
  };

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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Crédits</h1>
            <p className="text-muted-foreground">
              Gérez vos crédits et leurs échéances
            </p>
          </div>
          <CreditDialog
            trigger={
              <Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un crédit
              </Button>
            }
          />
        </div>

        {/* Carte récapitulative */}
        <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-white">Total des mensualités actives</CardTitle>
            <CardDescription className="text-violet-100">
              Montant total dû pour le mois en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalMensualites.toLocaleString('fr-FR')} €
            </div>
            <div className="text-violet-100 mt-2">
              {credits?.filter(credit => credit.statut === 'actif').length || 0} crédit(s) actif(s)
            </div>
          </CardContent>
        </Card>

        {/* Liste des crédits */}
        <div className="grid gap-2">
          {credits?.map((credit) => (
            <Card key={credit.id} className="overflow-hidden border bg-card dark:bg-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center px-4 gap-4 md:w-1/3">
                  {credit.logo_url ? (
                    <img
                      src={credit.logo_url}
                      alt={credit.nom_credit}
                      className="w-8 h-8 rounded-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-violet-100 rounded-full" />
                  )}
                  <div>
                    <h4 className="font-medium">{credit.nom_credit}</h4>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-card dark:bg-card">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Mensualité</span>
                    <h4 className="font-medium">
                      {credit.montant_mensualite.toLocaleString('fr-FR')} €
                    </h4>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Dernière échéance</span>
                    <span className="font-medium">
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

                <div className="px-4 py-2">
                  <CreditActions credit={credit} onCreditDeleted={handleCreditDeleted} />
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
