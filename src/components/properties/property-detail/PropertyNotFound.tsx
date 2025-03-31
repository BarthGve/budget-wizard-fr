
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const PropertyNotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-10 px-4"
    >
      <div className="mx-auto mb-6 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-3">Propriété non trouvée</h1>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        La propriété que vous recherchez n'existe pas ou a été supprimée.
      </p>
      
      <Button 
        onClick={() => navigate("/properties")}
        className="flex items-center gap-2"
      >
        <Home size={18} />
        Retourner aux propriétés
      </Button>
    </motion.div>
  );
};
