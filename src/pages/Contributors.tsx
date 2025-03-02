
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ContributorsHeader } from "@/components/contributors/ContributorsHeader";
import { ContributorsContent } from "@/components/contributors/ContributorsContent";
import StyledLoader from "@/components/ui/StyledLoader";
import { useContributorsData } from "@/hooks/useContributorsData";
import { memo } from "react";

// Using memo with a display name for better debugging
const Contributors = memo(function Contributors() {
  // Utilisation des données optimisées
  const { contributors, isLoading, handleAddContributor, handleUpdateContributor, handleDeleteContributor } = useContributorsData();
  
  if (isLoading) {
    return <DashboardLayout><StyledLoader /></DashboardLayout>;
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
});

export default Contributors;
