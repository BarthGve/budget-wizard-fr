
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsList } from "@/components/savings/SavingsList";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { NewProjectDialog } from "@/components/savings/NewProjectDialog";
import { SavingsProjectsList } from "@/components/savings/SavingsProjectsList";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface SavingsProject {
  id: string;
  nom_projet: string;
  montant_total: number;
  montant_mensuel: number;
  date_estimee: string;
  mode_planification: "par_date" | "par_mensualite";
  added_to_recurring: boolean;
}

const Savings = () => {
  const { monthlySavings, profile, refetch } = useDashboardData();

  const totalMonthlyAmount = monthlySavings?.reduce(
    (acc, saving) => acc + saving.amount,
    0
  ) || 0;

  const { data: projects, refetch: refetchProjects } = useQuery({
    queryKey: ["savings-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projets_epargne")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Transform the data to ensure all required fields are present
      return (data || []).map(project => ({
        id: project.id,
        nom_projet: project.nom_projet,
        montant_total: project.montant_total,
        montant_mensuel: project.montant_mensuel || 0,
        date_estimee: project.date_estimee || new Date().toISOString(),
        mode_planification: project.mode_planification,
        added_to_recurring: project.added_to_recurring || false
      })) as SavingsProject[];
    },
  });

  const handleProjectAdded = () => {
    refetchProjects();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Épargne</h1>
            <p className="text-muted-foreground">
              Gérez vos projets et versements mensuels d&apos;épargne
            </p>
          </div>
          <div className="flex gap-2">
            <NewProjectDialog onProjectAdded={handleProjectAdded} />
            <NewSavingDialog 
              onSavingAdded={refetch}
              trigger={
                <Button variant="outline">
                  Nouveau Versement
                </Button>
              }
            />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-12">
          <div className="col-span-8">
            <SavingsGoal
              savingsPercentage={profile?.savings_goal_percentage || 0}
              totalMonthlyAmount={totalMonthlyAmount}
            />
          </div>
          <div className="col-span-4">
            <SavingsPieChart
              monthlySavings={monthlySavings || []}
              totalSavings={totalMonthlyAmount}
            />
          </div>
        </div>

        <SavingsProjectsList 
          projects={projects || []} 
          onProjectDeleted={refetchProjects}
          onProjectEdit={(project) => console.log('Edit project:', project)}
        />

        <SavingsList
          monthlySavings={monthlySavings || []}
          onSavingDeleted={refetch}
        />
      </div>
    </DashboardLayout>
  );
};

export default Savings;
