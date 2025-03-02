
import { motion } from "framer-motion";
import { InvestmentDialog } from "./InvestmentDialog";

interface StocksHeaderProps {
  onSuccess: () => void;
}

export const StocksHeader = ({ onSuccess }: StocksHeaderProps) => {
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Bourse</h1>
          <p className="text-muted-foreground">
            Suivez vos investissements et les marchés en temps réel
          </p>
        </div>
      </motion.div>

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
      </motion.div>
    </>
  );
};
