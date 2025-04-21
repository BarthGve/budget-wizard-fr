
import { Card } from "@/components/ui/card";
import { Property } from "@/types/property";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";

interface PropertyDetailsCardProps {
  property: Property;
}

export const PropertyDetailsCard = ({ property }: PropertyDetailsCardProps) => {
  // Carte détails style harmonisé
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
          Détails
        </h2>
        <div className="grid gap-3 md:gap-4">
          <div>
            <span className="font-medium">Valeur d'achat :</span>{" "}
            {formatCurrency(property.purchase_value)}
          </div>
          <div>
            <span className="font-medium">Superficie :</span> {property.area} m²
          </div>
          {property.monthly_rent && <div>
            <span className="font-medium">Loyer mensuel :</span>{" "}
            {formatCurrency(property.monthly_rent)}
          </div>}
          <div>
            <span className="font-medium">Type d'investissement :</span>{" "}
            {property.investment_type || "Non spécifié"}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
