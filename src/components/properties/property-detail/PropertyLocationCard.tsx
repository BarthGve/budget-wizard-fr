
import { Card } from "@/components/ui/card";
import { Property } from "@/types/property";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { motion } from "framer-motion";

interface PropertyLocationCardProps {
  property: Property;
}

export const PropertyLocationCard = ({ property }: PropertyLocationCardProps) => {
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
        rotateY: 2,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Localisation</h2>
        <div className="h-[200px] w-full overflow-hidden rounded-lg">
          <PropertiesMap properties={[property]} />
        </div>
      </Card>
    </motion.div>
  );
};
