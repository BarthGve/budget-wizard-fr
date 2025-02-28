
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { useContributors } from "@/hooks/useContributors";

import StyledLoader from "@/components/ui/StyledLoader";


const Contributors = () => {
  const {
    contributors,
    isLoading,
    addContributor,
    updateContributor,
    deleteContributor
  } = useContributors();
  if (isLoading) {

    return <StyledLoader/>;


  }
  return <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Revenus</h1>
            <p className="text-muted-foreground">Indiquez vos rentrées d'argent régulières.</p>
          </div>
       
        </div>

        <Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>Listing</CardTitle>
      <CardDescription>
        Tous les contributeurs participant au budget
      </CardDescription>
    </div>
    <AddContributorDialog onAdd={addContributor} />
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      {contributors.map(contributor => <ContributorCard key={contributor.id} contributor={contributor} onEdit={updateContributor} onDelete={deleteContributor} />)}
    </div>
  </CardContent>
      </Card>
      </div>
    </DashboardLayout>;
};
export default Contributors;
