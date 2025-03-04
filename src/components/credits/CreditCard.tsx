
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { CreditInfoDialog } from "./CreditInfoDialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreditProgressBar } from "./CreditProgressBar";

interface CreditCardProps {
  credit: Credit;
  index: number;
  onCreditDeleted: () => void;
}

export const CreditCard = ({ credit, index, onCreditDeleted }: CreditCardProps) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <>
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
            <CreditCardInfo credit={credit} index={index} onClick={() => setShowInfoDialog(true)} />
            <CreditCardDetails credit={credit} index={index} />
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

      <CreditInfoDialog
        credit={credit}
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />
    </>
  );
};

interface CreditCardInfoProps {
  credit: Credit;
  index: number;
  onClick: () => void;
}

export const CreditCardInfo = ({ credit, index, onClick }: CreditCardInfoProps) => {
  return (
    <div 
      className="flex items-center px-4 gap-4 md:w-1/3 cursor-pointer hover:bg-muted/20 rounded-md p-2 transition-colors"
      onClick={onClick}
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
  
      <h4 className="font-medium">{credit.nom_credit}</h4>
    </div>
  );
};

interface CreditCardDetailsProps {
  credit: Credit;
  index: number;
}

export const CreditCardDetails = ({ credit, index }: CreditCardDetailsProps) => {
  return (
   <>
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
        <span className="text-sm text-muted-foreground">Progression</span>
        <div className="w-full">
          <CreditProgressBar 
            dateDebut={credit.date_premiere_mensualite}
            dateFin={credit.date_derniere_mensualite}
            montantMensuel={credit.montant_mensualite}
          />
        </div>
      </div>
   </>
  );
};
