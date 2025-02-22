
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Credit } from "@/components/credits/types";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditSummaryCards } from "@/components/credits/CreditSummaryCards";
import { CreditsList } from "@/components/credits/CreditsList";
import { CreditsPagination } from "@/components/credits/CreditsPagination";

const Credits = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string>("5");
  
  const queryClient = useQuery;
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

  const { data: credits = [], isLoading } = useQuery({
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
        .order("date_derniere_mensualite", { ascending: false });

      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }

      return data as Credit[];
    }
  });

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Séparer les crédits actifs et remboursés
  const activeCredits = credits.filter(credit => credit.statut === 'actif');
  const repaidCredits = credits.filter(credit => credit.statut === 'remboursé');

  const totalActiveMensualites = activeCredits.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
  const totalRepaidMensualites = repaidCredits.reduce((sum, credit) => 
    new Date(credit.date_derniere_mensualite) >= firstDayOfMonth ? sum + credit.montant_mensualite : sum, 0
  );

  // Pagination logic
  const itemsPerPageNumber = itemsPerPage === "all" ? credits.length : parseInt(itemsPerPage);
  const totalPages = Math.ceil(credits.length / itemsPerPageNumber);
  
  const getPaginatedCredits = () => {
    if (itemsPerPage === "all") return [...activeCredits, ...repaidCredits];
    
    const startIndex = (currentPage - 1) * itemsPerPageNumber;
    const endIndex = startIndex + itemsPerPageNumber;
    return [...activeCredits, ...repaidCredits].slice(startIndex, endIndex);
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

        <CreditSummaryCards 
          activeCredits={activeCredits}
          repaidCredits={repaidCredits}
          totalActiveMensualites={totalActiveMensualites}
          totalRepaidMensualites={totalRepaidMensualites}
          firstDayOfMonth={firstDayOfMonth}
        />

        <CreditsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value: string) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />

        <CreditsList credits={getPaginatedCredits()} />
      </div>
    </DashboardLayout>
  );
};

export default Credits;
