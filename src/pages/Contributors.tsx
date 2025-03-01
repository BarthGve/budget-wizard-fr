
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ContributorsHeader } from "@/components/contributors/ContributorsHeader";
import { ContributorsContent } from "@/components/contributors/ContributorsContent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StyledLoader from "@/components/ui/StyledLoader";
import { useContributorsData } from "@/hooks/useContributorsData";

const Contributors = () => {
  const navigate = useNavigate();
  const { contributors, isLoading, handleAddContributor, handleUpdateContributor, handleDeleteContributor } = useContributorsData();

  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return <StyledLoader/>;
  }
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <ContributorsHeader />
        <Card>
          <ContributorsContent 
            contributors={contributors} 
            onAdd={handleAddContributor}
            onUpdate={handleUpdateContributor}
            onDelete={handleDeleteContributor}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contributors;
