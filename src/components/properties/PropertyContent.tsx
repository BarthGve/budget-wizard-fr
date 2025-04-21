
// Harmonisation des backgrounds, espaces et responsive
import { motion } from "framer-motion";
import { Property } from "@/types/property";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyContentProps {
  properties: Property[] | undefined;
  isLoading: boolean;
}

export const PropertyContent = ({ properties, isLoading }: PropertyContentProps) => {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.97
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 16
      }
    }
  };
  const isMobile = useIsMobile();
  return (
    <div className={cn(
      "flex flex-col gap-6 w-full",
      isMobile ? "gap-4" : "gap-6"
    )}>
      {/* Carte contenant la map pour homogénéité */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "rounded-2xl shadow-lg border bg-white/60 dark:bg-quaternary-900/30",
          "px-2 py-4 md:px-4 md:py-7",
          "hover:shadow-xl transition-all duration-200",
          "backdrop-blur-sm"
        )}
      >
        <PropertiesMap properties={properties || []} />
      </motion.div>
      {/* Liste des propriétés, gap réduit sur mobile */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <PropertyList properties={properties || []} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};
