
// Harmonisation du layout avec l'app
import { motion } from "framer-motion";
import { Property } from "@/types/property";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertiesMap } from "@/components/properties/PropertiesMap";

interface PropertyContentProps {
  properties: Property[] | undefined;
  isLoading: boolean;
}

export const PropertyContent = ({ properties, isLoading }: PropertyContentProps) => {
  // Animations cohérentes
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 16,
      },
    },
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Carte interactive au-dessus, bien aérée */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="rounded-lg overflow-hidden border"
      >
        <PropertiesMap properties={properties || []} />
      </motion.div>
      {/* Liste harmonisée */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <PropertyList properties={properties || []} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};
