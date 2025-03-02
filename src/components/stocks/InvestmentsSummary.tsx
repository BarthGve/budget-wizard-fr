
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CurrentYearInvestmentsDialog } from "./CurrentYearInvestmentsDialog";
import { YearlyInvestmentsDialog } from "./YearlyInvestmentsDialog";
import { InvestmentHistory } from "./InvestmentHistory";
import { Investment } from "./types/investments";
import { InvestmentDialog } from "./InvestmentDialog";

interface InvestmentsSummaryProps {
  yearlyData: Array<{ year: number; amount: number }>;
  currentYearTotal: number;
  totalInvestment: number;
  currentYearInvestments: Investment[];
  onSuccess: () => void;
  formatPrice: (price: number) => string;
}

export const InvestmentsSummary = ({
  yearlyData,
  currentYearTotal,
  totalInvestment,
  currentYearInvestments,
  onSuccess,
  formatPrice
}: InvestmentsSummaryProps) => {
  const [currentYearDialogOpen, setCurrentYearDialogOpen] = useState(false);
  const [yearlyTotalDialogOpen, setYearlyTotalDialogOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

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

  return (
    <>
          <motion.div className="flex justify-between items-center" variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
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
      }}>
        <div>
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl">Compte titre</h2>
          <p className="text-muted-foreground">
            Renseigner les sommes investies dans votre portefeuille
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <InvestmentDialog onSuccess={onSuccess} />
        </motion.div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
  
      </motion.div>
        {/* Colonne de gauche (1/3) avec les cards */}
        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03, 
              rotateY: 5,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => setCurrentYearDialogOpen(true)}>
              <CardHeader>
                <CardTitle>Total {new Date().getFullYear()}</CardTitle>
                <CardDescription>Montant total investi cette année</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(currentYearTotal)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03, 
              rotateY: 5,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => setYearlyTotalDialogOpen(true)}>
              <CardHeader>
                <CardTitle>Total global</CardTitle>
                <CardDescription>Montant total de tous les investissements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(totalInvestment)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        {/* Colonne de droite (2/3) avec le graphique */}
        <motion.div 
          className="col-span-2"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Historique des investissements</CardTitle>
              <CardDescription>Évolution de vos investissements sur les 5 dernières années</CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-full">
                <InvestmentHistory data={yearlyData} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <CurrentYearInvestmentsDialog 
        open={currentYearDialogOpen} 
        onOpenChange={setCurrentYearDialogOpen} 
        investments={currentYearInvestments} 
        onSuccess={onSuccess} 
      />

      <YearlyInvestmentsDialog 
        open={yearlyTotalDialogOpen} 
        onOpenChange={setYearlyTotalDialogOpen} 
        yearlyData={yearlyData} 
      />
    </>
  );
};
