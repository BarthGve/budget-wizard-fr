
// Adaptation du design général pour cohérence totale avec la page épargne (fond, glassmorphism, gradient, padding...)
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PropertiesHeader } from "@/components/properties/PropertiesHeader";
import { PropertyContent } from "@/components/properties/PropertyContent";
import { TooltipProvider } from "@/components/ui/tooltip";

// On harmonise le fond, le conteneur principal "glass", les espacements et la structure
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
        // On reprend l'approche de la page épargne pour les paddings/centreur
        className="container mx-auto flex flex-col px-4 py-6 md:px-8 space-y-0 min-h-[100dvh] md:min-h-[80vh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          background:
            "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)"
        }}
      >
        {/* Carte principale avec glassmorphism et gradient comme sur Épargne. */}
        <div className="w-full rounded-2xl glass shadow-xl border border-white/30 bg-white/80 dark:bg-gray-900/60 p-2 md:p-6 lg:p-10 max-w-4xl mx-auto space-y-8 backdrop-blur-md">
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

