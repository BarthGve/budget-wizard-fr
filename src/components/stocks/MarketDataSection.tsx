
import { motion } from "framer-motion";
import { MarketDataCard } from "./MarketDataCard";

interface MarketData {
  symbol: string;
  data: any;
  history: any;
}

interface MarketDataSectionProps {
  marketCards: MarketData[];
  isLoading: boolean;
}

export const MarketDataSection = ({ marketCards, isLoading }: MarketDataSectionProps) => {
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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
    >
      {marketCards.map(({
        symbol,
        data,
        history
      }, index) => (
        <motion.div 
          key={symbol}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.03, 
            rotateY: 5,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ delay: index * 0.05 }}
        >
          <MarketDataCard 
            symbol={symbol} 
            data={data} 
            history={history} 
            isLoading={isLoading}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
