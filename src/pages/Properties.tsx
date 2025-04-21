
// Adaptation du design général en cohérence avec l'app
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PropertiesHeader } from "@/components/properties/PropertiesHeader";
import { PropertyContent } from "@/components/properties/PropertyContent";
import { TooltipProvider } from "@/components/ui/tooltip";

// On harmonise le fond, le conteneur principal et les espacements
const Properties = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No session");
      }
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching properties:", error);
        toast.error("Erreur lors du chargement des propriétés");
        throw error;
      }
      return data;
    },
  });

  // Animation du conteneur
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.10
      }
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        className="container mx-auto max-w-4xl py-8 px-2 md:px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Ajout d'une carte globale pour plus d'homogénéité */}
        <div className="bg-card shadow-lg rounded-lg border p-4 md:p-8 space-y-8">
          {/* Header harmonisé */}
          <PropertiesHeader />
          {/* Contenu des propriétés */}
          <PropertyContent properties={properties} isLoading={isLoading} />
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
export default Properties;
