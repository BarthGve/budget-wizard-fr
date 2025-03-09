import { motion } from "framer-motion";
import { Wallet } from "lucide-react"; // Icône pour représenter les revenus

export const ContributorsHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-4 mb-2 border-b border-gray-100 flex items-center justify-between"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg shadow-sm mt-0.5"
        >
          <Wallet className="h-6 w-6 text-green-600" />
        </motion.div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Revenus
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Indiquez vos rentrées d'argent régulières
          </p>
        </div>
      </div>
    </motion.div>
  );
};
