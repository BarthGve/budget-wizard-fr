
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import StyledLoader from "@/components/ui/StyledLoader";
import { fetchContributorsService } from "@/services/contributors";
import { Link } from "react-router-dom";
import { ContributorsRealtime } from "@/components/contributors/ContributorsRealtime";
import { ContributorsList } from "@/components/contributors/ContributorsList";
import { useContributorActions } from "@/components/contributors/ContributorActions";

const Contributors = () => {
  const { 
    handleAddContributor, 
    handleUpdateContributor, 
    handleDeleteContributor 
  } = useContributorActions();

  // Utilisation de useQuery avec fetchContributorsService et configuration optimisée
  const { data: contributors = [], isLoading } = useQuery({
    queryKey: ["contributors"],
    queryFn: fetchContributorsService,
    staleTime: 1000 * 60 * 2, // 2 minutes - réduire le nombre de requêtes
    gcTime: 1000 * 60 * 5 // 5 minutes - remplace cacheTime dans les nouvelles versions de React Query
  });
  
  if (isLoading) {
    return <StyledLoader/>;
  }
  
  return (
    <DashboardLayout>
      {/* Component handling Supabase realtime subscriptions */}
      <ContributorsRealtime />
      
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Revenus</h1>
            <p className="text-muted-foreground">Indiquez vos rentrées d'argent régulières.</p>
          </div>
          <div>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">
              Retour au dashboard
            </Link>
          </div>
        </div>

        <ContributorsList 
          contributors={contributors}
          onAdd={handleAddContributor}
          onUpdate={handleUpdateContributor}
          onDelete={handleDeleteContributor}
        />
      </div>
    </DashboardLayout>
  );
};

export default Contributors;
