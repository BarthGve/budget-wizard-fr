
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";

export const PropertiesHeader = () => {
  return (
    <motion.div className="flex items-center justify-between" variants={{
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Propriétés</h1>
        <p className="text-muted-foreground">
          Gérez vos biens immobiliers et suivez leurs performances
        </p>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AddPropertyDialog />
      </motion.div>
    </motion.div>
  );
};
