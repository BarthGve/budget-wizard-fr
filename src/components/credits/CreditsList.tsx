
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  return (
    <div className="grid gap-2">
      {sortedCredits.map((credit, index) => (
        <motion.div
          key={credit.id}
          initial={{ 
            opacity: 0,
            y: 50,
            rotateX: 45,
            scale: 0.9,
            z: -100
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            scale: 1,
            z: 0
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: index * 0.1,
            duration: 0.5
          }}
          whileHover={{
            scale: 1.02,
            z: 20,
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            transition: { duration: 0.2 }
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
          className="transform-gpu"
        >
          <Card
            className={cn(
              "overflow-hidden border bg-card dark:bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-1">
              {/* Infos principales */}
              <div className="flex items-center px-4 gap-4 md:w-1/3">
                <motion.div
                  initial={{ rotate: -30, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                >
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
                </motion.div>
                <h4 className="font-medium">{credit.nom_credit}</h4>
              </div>

              {/* Détails du crédit */}
              <motion.div 
                className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-card dark:bg-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              >
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
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
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
                  </motion.span>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                className="px-4 py-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              >
                <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
