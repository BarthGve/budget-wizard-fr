
import { motion } from "framer-motion";

export const EmptySavings = () => {
  return (
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center text-muted-foreground py-4"
    >
      Aucune épargne enregistrée
    </motion.p>
  );
};
