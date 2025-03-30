
import { useState } from "react";
import { ContributorsTable } from "../ContributorsTable";
import { motion } from "framer-motion";
import { ContributorDetailsDialog } from "../ContributorDetailsDialog";
import { Contributor } from "@/types/contributor";

interface DashboardContributorsProps {
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

export const DashboardContributors = ({
  contributors,
  expenses,
  totalMensualites,
}: DashboardContributorsProps) => {
  // État pour gérer le dialogue des détails du contributeur
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Gestionnaire pour la sélection d'un contributeur
  const handleSelectContributor = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setDialogOpen(true);
  };

  // N'afficher le tableau que s'il y a plus d'un contributeur
  if (!contributors || contributors.length <= 1) return null;

  return (
    <>
      <motion.div variants={itemVariants}>
        <ContributorsTable 
          contributors={contributors}
          totalExpenses={expenses}
          totalCredits={totalMensualites}
          onSelectContributor={handleSelectContributor}
        />
      </motion.div>

      {/* Dialogue des détails du contributeur */}
      {selectedContributor && (
        <ContributorDetailsDialog 
          contributor={selectedContributor}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
