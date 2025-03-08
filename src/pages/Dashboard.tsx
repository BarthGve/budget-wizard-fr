
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/dashboard-header/DashboardHeader';
import { DashboardCards } from '@/components/dashboard/dashboard-content/DashboardCards';
import { DashboardCharts } from '@/components/dashboard/dashboard-content/DashboardCharts';
import { DashboardContributors } from '@/components/dashboard/dashboard-content/DashboardContributors';
import { DashboardBanners } from '@/components/dashboard/dashboard-banners/DashboardBanners';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<'monthly' | 'yearly'>('monthly');
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();
  
  // Récupération des crédits
  const { data: credits = [] } = useQuery({
    queryKey: ["dashboard-credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calcul des montants totaux
  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalMensualites = credits?.reduce((sum, credit) => sum + credit.montant_mensualite, 0) || 0;
  const totalSavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  
  // Construction des données pour les parts des contributeurs
  const contributorShares = contributors?.map(contributor => ({
    name: contributor.name,
    start: 0,
    end: contributor.percentage_contribution,
    amount: contributor.total_contribution
  })) || [];
  
  // Obtenir le nom du mois courant
  const monthNames = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];
  const currentMonthName = monthNames[new Date().getMonth()];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader 
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentMonthName={currentMonthName}
        />
        <DashboardBanners />
        <DashboardCards 
          revenue={totalRevenue}
          expenses={totalExpenses}
          totalMensualites={totalMensualites}
          savings={totalSavings}
          savingsGoal={0}
          contributorShares={contributorShares}
          recurringExpenses={recurringExpenses || []}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCharts 
            expenses={totalExpenses}
            savings={totalSavings}
            totalMensualites={totalMensualites}
            credits={credits}
            recurringExpenses={recurringExpenses || []}
            monthlySavings={monthlySavings || []}
          />
          <DashboardContributors 
            contributors={contributors || []}
            expenses={totalExpenses}
            totalMensualites={totalMensualites}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
