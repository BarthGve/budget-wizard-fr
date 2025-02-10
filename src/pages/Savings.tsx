
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { MonthlyTotal } from "@/components/savings/MonthlyTotal";
import { NewSavingForm } from "@/components/savings/NewSavingForm";
import { SavingsList } from "@/components/savings/SavingsList";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

const Savings = () => {
  const [monthlySavings, setMonthlySavings] = useState<MonthlySaving[]>([]);
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("savings_goal_percentage")
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences d'épargne",
        variant: "destructive",
      });
      return;
    }

    setSavingsPercentage(data?.savings_goal_percentage || 0);
  };

  const fetchMonthlySavings = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("monthly_savings")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les versements mensuels",
        variant: "destructive",
      });
      return;
    }

    setMonthlySavings(data || []);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchMonthlySavings();
  }, []);

  const totalMonthlyAmount = monthlySavings.reduce(
    (acc, saving) => acc + saving.amount,
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Épargne</h1>
          <p className="text-muted-foreground">
            Gérez vos versements mensuels d'épargne
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SavingsGoal
            savingsPercentage={savingsPercentage}
            setSavingsPercentage={setSavingsPercentage}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            totalMonthlyAmount={totalMonthlyAmount}
          />

          <MonthlyTotal totalMonthlyAmount={totalMonthlyAmount} />

          <NewSavingForm onSavingAdded={fetchMonthlySavings} />

          <SavingsList
            monthlySavings={monthlySavings}
            onSavingDeleted={fetchMonthlySavings}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Savings;
