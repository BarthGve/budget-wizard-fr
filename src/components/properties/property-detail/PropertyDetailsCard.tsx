
import { Card } from "@/components/ui/card";
import { Property } from "@/types/property";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";

interface PropertyDetailsCardProps {
  property: Property;
}

export const PropertyDetailsCard = ({ property }: PropertyDetailsCardProps) => {
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
        <h2 className="text-xl font-semibold mb-4">Détails</h2>
        <div className="grid gap-4">
          <div>
            <span className="font-medium">Valeur d'achat:</span>{" "}
            {formatCurrency(property.purchase_value)}
          </div>
          <div>
            <span className="font-medium">Superficie:</span> {property.area} m²
          </div>
          {property.monthly_rent && <div>
              <span className="font-medium">Loyer mensuel:</span>{" "}
              {formatCurrency(property.monthly_rent)}
            </div>}
          <div>
            <span className="font-medium">Type d'investissement:</span>{" "}
            {property.investment_type || "Non spécifié"}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
