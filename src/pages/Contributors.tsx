import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { useContributors } from "@/hooks/useContributors";
const Contributors = () => {
  const {
    contributors,
    isLoading,
    addContributor,
    updateContributor,
    deleteContributor
  } = useContributors();
  if (isLoading) {
    return <DashboardLayout>
        <div>Chargement...</div>
      </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contributeurs</h1>
            <p className="text-muted-foreground">Gérez les acteurs du budget</p>
          </div>
          <AddContributorDialog onAdd={addContributor} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listing</CardTitle>
            <CardDescription>
              Tous les contributeurs participant au budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributors.map(contributor => <ContributorCard key={contributor.id} contributor={contributor} onEdit={updateContributor} onDelete={deleteContributor} />)}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
};
export default Contributors;