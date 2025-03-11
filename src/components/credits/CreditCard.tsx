
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreditCardInfo } from "./card-components/CreditCardInfo";
import { CreditCardDetails } from "./card-components/CreditCardDetails";

interface CreditCardProps {
  credit: Credit;
  index: number;
  onCreditDeleted: () => void;
}

export const CreditCard = ({ credit, index, onCreditDeleted }: CreditCardProps) => {
  return (
    <motion.div
      key={credit.id}
      initial={{ 
        opacity: 0,
        y: 20,
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="transform-gpu"
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          // Light mode
          "bg-white border border-purple-100 shadow-sm hover:shadow-md",
          // Dark mode
          "dark:bg-gray-800/90 dark:border-purple-800/40 dark:hover:border-purple-700/60"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
          <CreditCardInfo credit={credit} index={index} />
          <CreditCardDetails credit={credit} index={index} />
          <motion.div 
            className="px-4 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.3 }}
          >
            <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
