
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyList } from "@/components/properties/PropertyList";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  const itemVariants = {
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
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="grid gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex items-center justify-between" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Propriétés</h1>
            <p className="text-muted-foreground">
              Gérez vos biens immobiliers et suivez leurs performances
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AddPropertyDialog />
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
          }}
        >
          <PropertiesMap properties={properties || []} />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <PropertyList properties={properties || []} isLoading={isLoading} />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Properties;
