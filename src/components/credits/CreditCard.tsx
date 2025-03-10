
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditProgressBar } from "./CreditProgressBar";

interface CreditCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  amount: number;
  subtitle: string;
  badgeText: string;
  colorScheme: "purple" | "green" | "blue";
  actionMenu?: ReactNode;
  index: number;
  dateDebut: string;
  dateFin: string;
}

export const CreditCard = ({
  icon,
  title,
  description,
  amount = 0, // Valeur par défaut pour éviter les undefined
  subtitle,
  badgeText,
  colorScheme = "purple", // Changé pour purple par défaut pour correspondre au design du site
  actionMenu,
  index,
  dateDebut,
  dateFin
}: CreditCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // S'assurer que amount est un nombre valide
  const safeAmount = typeof amount === 'number' ? amount : 0;
  
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: 20,
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="transform-gpu"
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200",
          // Light mode
          "bg-white border border-purple-100 shadow-sm hover:shadow-md",
          // Dark mode
          "dark:bg-gray-800/90 dark:border-purple-800/40 dark:hover:border-purple-700/60"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
          {/* Colonne de gauche - Info de crédit */}
          <div 
            className={cn(
              "flex items-center gap-4 md:w-1/3 rounded-md p-2 transition-colors",
              // Light mode
              "hover:bg-purple-50/70",
              // Dark mode
              "dark:hover:bg-purple-900/20"
            )}
          >
            {typeof icon === 'string' ? (
              <div className={cn(
                "w-10 h-10 rounded-lg p-1 flex items-center justify-center overflow-hidden",
                // Light mode
                "bg-white border border-purple-100 shadow-sm",
                // Dark mode
                "dark:bg-gray-800 dark:border-purple-800/40"
              )}>
                <img
                  src={icon}
                  alt={title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            ) : (
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                // Light mode
                "bg-purple-100 text-purple-600",
                // Dark mode
                "dark:bg-purple-900/30 dark:text-purple-400"
              )}>
                {icon}
              </div>
            )}
        
            <h4 className={cn(
              "font-medium text-base",
              // Light mode
              "text-gray-800",
              // Dark mode
              "dark:text-gray-200"
            )}>
              {title}
            </h4>
          </div>

          {/* Colonne du milieu - Détails */}
          <div className="grid grid-cols-3 gap-6 flex-1 py-2 px-4">
            <div className="flex flex-col">
              <span className={cn(
                "text-sm",
                // Light mode
                "text-gray-500",
                // Dark mode
                "dark:text-gray-400"
              )}>
                Mensualité
              </span>
              <h4 className={cn(
                "font-medium",
                // Light mode
                "text-gray-800",
                // Dark mode
                "dark:text-gray-200"
              )}>
                {safeAmount.toLocaleString("fr-FR") + " €"}
              </h4>
            </div>

            <div className="flex flex-col">
              <span className={cn(
                "text-sm",
                // Light mode
                "text-gray-500",
                // Dark mode
                "dark:text-gray-400"
              )}>
                Dernière échéance
              </span>
              <span className={cn(
                "font-medium",
                // Light mode
                "text-gray-800",
                // Dark mode
                "dark:text-gray-200"
              )}>
                {dateFin ? new Date(dateFin).toLocaleDateString("fr-FR") : "N/A"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className={cn(
                "text-sm",
                // Light mode
                "text-gray-500",
                // Dark mode
                "dark:text-gray-400"
              )}>
                Progression
              </span>
              <div className="w-full mt-1">
                <CreditProgressBar 
                  dateDebut={dateDebut}
                  dateFin={dateFin}
                  montantMensuel={safeAmount}
                />
              </div>
            </div>
          </div>

          {/* Colonne de droite - Actions */}
          <motion.div 
            className="px-4 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {actionMenu}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
