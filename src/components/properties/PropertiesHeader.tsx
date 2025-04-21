
// Header adapté à l'identité graphique de l'app
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";

export const PropertiesHeader = () => {
  return (
    <motion.div
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 pb-2 border-b border-border"
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        },
      }}
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient-primary">Propriétés</h1>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
          Gérez vos biens immobiliers et suivez leurs performances
        </p>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex md:block"
      >
        <AddPropertyDialog />
      </motion.div>
    </motion.div>
  );
};
