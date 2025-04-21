
import { motion } from "framer-motion";
import { Property } from "@/types/property";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertiesMap } from "@/components/properties/PropertiesMap";

interface PropertyContentProps {
  properties: Property[] | undefined;
  isLoading: boolean;
}

export const PropertyContent = ({ properties, isLoading }: PropertyContentProps) => {
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
    <>
      <motion.div 
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
        }}
      >
        <PropertiesMap properties={properties || []} />
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <PropertyList properties={properties || []} isLoading={isLoading} />
      </motion.div>
    </>
  );
};
