
import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardContributors } from "../dashboard-content/DashboardContributors";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContributorsMobileCard } from "../contributors-mobile/ContributorsMobileCard";
import { ContributorDetailsDialog } from "../ContributorDetailsDialog";
import { Contributor } from "@/types/contributor";

const MemoizedDashboardContributors = memo(DashboardContributors);

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

interface ContributorsSectionProps {
  contributors: Array<{
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner: boolean;
    profile_id: string;
    expenseShare: number;
    creditShare: number;
  }>;
  expenses: number;
  totalMensualites: number;
}

/**
 * Composant qui affiche la section des contributeurs
 */
export const ContributorsSection = ({
  contributors,
  expenses,
  totalMensualites,
}: ContributorsSectionProps) => {
  const isMobile = useIsMobile();
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // N'afficher la section des contributeurs que s'il y a plus d'un contributeur
  // Sur mobile, on n'affiche pas la section s'il n'y a qu'un seul contributeur
  const showContributorsSection = useMemo(() => {
    return isMobile ? contributors.length > 1 : contributors.length > 0;
  }, [contributors.length, isMobile]);

  const handleSelectContributor = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setDialogOpen(true);
  };

  if (!showContributorsSection) return null;

  return (
    <>
      <motion.div variants={itemVariants}>
        {isMobile ? (
          <ContributorsMobileCard 
            contributors={contributors} 
            onSelectContributor={handleSelectContributor}
          />
        ) : (
          <MemoizedDashboardContributors 
            contributors={contributors}
            expenses={expenses}
            totalMensualites={totalMensualites}
          />
        )}
      </motion.div>

      {/* Dialogue pour les détails du contributeur */}
      {selectedContributor && (
        <ContributorDetailsDialog
          contributor={selectedContributor}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
