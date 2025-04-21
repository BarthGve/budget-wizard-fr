
import { Card } from "@/components/ui/card";
import { Property } from "@/types/property";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { motion } from "framer-motion";

interface PropertyLocationCardProps {
  property: Property;
}

export const PropertyLocationCard = ({ property }: PropertyLocationCardProps) => {
  // Carte localisation harmonisée visuel
  return (
    <motion.div 
      variants={{
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
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(90,81,207,0.08)"
      }}
      className="w-full"
    >
      <Card className="p-6 bg-white/80 dark:bg-quaternary-900/40 shadow-lg rounded-2xl border border-white/20 dark:border-quaternary-900/20">
        <h2 className="text-lg md:text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Localisation
        </h2>
        <div className="h-[180px] md:h-[200px] w-full overflow-hidden rounded-xl">
          <PropertiesMap properties={[property]} />
        </div>
      </Card>
    </motion.div>
  );
};

