
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { motion } from "framer-motion";

interface CreditsListProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const CreditsList = ({ credits, onCreditDeleted }: CreditsListProps) => {
  if (!credits || credits.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          Aucun crédit trouvé
        </div>
      </Card>
    );
  }

  const sortedCredits = [...credits].sort((a, b) => {
    return (
      new Date(a.date_derniere_mensualite).getTime() -
      new Date(b.date_derniere_mensualite).getTime()
    );
  });

  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      rotateX: 30,
      scale: 0.9,
      z: -100
    },
    show: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      scale: 1,
      z: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="grid gap-2 perspective-500"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {sortedCredits.map((credit, index) => (
        <motion.div
          key={credit.id}
          variants={itemVariants}
          custom={index}
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{ 
            scale: 1.02, 
            rotateY: 2,
            transition: { duration: 0.2 }
          }}
        >
          <Card
            className="overflow-hidden border bg-card dark:bg-card transform-gpu"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-1">
              {/* Infos principales */}
              <div className="flex items-center px-4 gap-4 md:w-1/3">
                {credit.logo_url ? (
                  <img
                    src={credit.logo_url}
                    alt={credit.nom_credit}
                    className="w-8 h-8 rounded-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-violet-100 rounded-full" />
                )}
                <h4 className="font-medium">{credit.nom_credit}</h4>
              </div>

              {/* Détails du crédit */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-card dark:bg-card">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Mensualité</span>
                  <h4 className="font-medium">
                    {credit.montant_mensualite
                      ? credit.montant_mensualite.toLocaleString("fr-FR") + " €"
                      : "N/A"}
                  </h4>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Dernière échéance</span>
                  <span className="font-medium">
                    {credit.date_derniere_mensualite
                      ? new Date(credit.date_derniere_mensualite).toLocaleDateString("fr-FR")
                      : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <span
                    className={`inline-flex items-center ${
                      credit.statut.toLowerCase() === "actif"
                        ? "text-green-600"
                        : credit.statut.toLowerCase() === "remboursé"
                        ? "text-gray-600"
                        : ""
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        credit.statut.toLowerCase() === "actif"
                          ? "bg-green-600"
                          : credit.statut.toLowerCase() === "remboursé"
                          ? "bg-gray-600"
                          : ""
                      }`}
                    />
                    {credit.statut}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-2">
                <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
