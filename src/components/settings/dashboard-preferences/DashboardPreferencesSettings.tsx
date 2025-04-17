
import { DashboardPreferencesCard } from "./DashboardPreferencesCard";
import { DashboardToggle } from "./DashboardToggle";
import { useDashboardPreferences } from "./useDashboardPreferences";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const DashboardPreferencesSettings = () => {
  const { profile } = usePagePermissions();
  const {
    showRevenueCard,
    showExpensesCard,
    showCreditsCard,
    showSavingsCard,
    showExpenseStats,
    showCharts,
    showContributors,
    showSavingsProjectsCard,
    isUpdating,
    handleRevenueCardToggle,
    handleExpensesCardToggle,
    handleCreditsCardToggle,
    handleSavingsCardToggle,
    handleExpenseStatsToggle,
    handleChartsToggle,
    handleContributorsToggle,
    handleSavingsProjectsCardToggle
  } = useDashboardPreferences(profile);

  return (
    <DashboardPreferencesCard>
      <DashboardToggle
        label="Carte des Revenus"
        description="Afficher la carte des revenus sur le tableau de bord"
        tooltipContent="Affiche ou masque la carte des revenus sur votre tableau de bord"
        checked={showRevenueCard}
        onCheckedChange={handleRevenueCardToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Carte des Charges"
        description="Afficher la carte des charges récurrentes sur le tableau de bord"
        tooltipContent="Affiche ou masque la carte des charges récurrentes sur votre tableau de bord"
        checked={showExpensesCard}
        onCheckedChange={handleExpensesCardToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Carte des Crédits"
        description="Afficher la carte des crédits sur le tableau de bord"
        tooltipContent="Affiche ou masque la carte des crédits sur votre tableau de bord"
        checked={showCreditsCard}
        onCheckedChange={handleCreditsCardToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Carte d'Épargne"
        description="Afficher la carte d'épargne sur le tableau de bord"
        tooltipContent="Affiche ou masque la carte d'épargne sur votre tableau de bord"
        checked={showSavingsCard}
        onCheckedChange={handleSavingsCardToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Carte des Projets d'Épargne"
        description="Afficher la carte des projets d'épargne sur le tableau de bord"
        tooltipContent="Affiche ou masque la carte des projets d'épargne sur votre tableau de bord"
        checked={showSavingsProjectsCard}
        onCheckedChange={handleSavingsProjectsCardToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Statistiques des Dépenses"
        description="Afficher les statistiques des dépenses sur le tableau de bord"
        tooltipContent="Affiche ou masque les statistiques des dépenses sur votre tableau de bord"
        checked={showExpenseStats}
        onCheckedChange={handleExpenseStatsToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Graphiques"
        description="Afficher les graphiques sur le tableau de bord"
        tooltipContent="Affiche ou masque les graphiques sur votre tableau de bord"
        checked={showCharts}
        onCheckedChange={handleChartsToggle}
        disabled={isUpdating}
      />

      <DashboardToggle
        label="Contributeurs"
        description="Afficher la section des contributeurs sur le tableau de bord"
        tooltipContent="Affiche ou masque la section des contributeurs sur votre tableau de bord"
        checked={showContributors}
        onCheckedChange={handleContributorsToggle}
        disabled={isUpdating}
      />
    </DashboardPreferencesCard>
  );
};
