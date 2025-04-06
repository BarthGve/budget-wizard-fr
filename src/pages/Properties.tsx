
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PropertiesHeader } from "@/components/properties/PropertiesHeader";
import { PropertyContent } from "@/components/properties/PropertyContent";
import { TooltipProvider } from "@/components/ui/tooltip";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <TooltipProvider>
      <motion.div 
        className="grid gap-6 container px-4 py-6 mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <PropertiesHeader />
        <PropertyContent properties={properties} isLoading={isLoading} />
      </motion.div>
    </TooltipProvider>
  );
};

export default Properties;
