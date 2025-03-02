
import { motion } from "framer-motion";

export const SavingsHeader = () => {
  return (
    <motion.div 
      className="flex-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Épargne
          </h1>
          <p className="text-muted-foreground">
            Prévoyez vos versements mensuels d'épargne
          </p>
        </div>
      </div>
    </motion.div>
  );
};
