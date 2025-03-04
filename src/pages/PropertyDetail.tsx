
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { AddExpenseDialog } from "@/components/properties/AddExpenseDialog";
import { ExpensesList } from "@/components/properties/ExpensesList";
import { ExpensesChart } from "@/components/properties/expenses/ExpensesChart";
import { PropertyWeather } from "@/components/properties/PropertyWeather";
import { ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import { motion } from "framer-motion";

const PropertyDetail = () => {
  const { id } = useParams();
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: property,
    isLoading: isLoadingProperty
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("properties").select("*").eq("id", id).single();
      if (error) {
        console.error("Error fetching property:", error);
        toast.error("Erreur lors du chargement de la propriété");
        throw error;
      }
      return data;
    }
  });

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ["property-expenses", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("property_expenses").select("*").eq("property_id", id).order("date", {
        ascending: false
      });
      if (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Erreur lors du chargement des dépenses");
        throw error;
      }
      return data;
    }
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

  if (isLoadingProperty) {
    return (
      <DashboardLayout>
        <div className="grid gap-6 mt-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Propriété non trouvée</h1>
          <p className="text-muted-foreground">
            La propriété que vous recherchez n'existe pas.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const handleExpenseEdit = (expense: any) => {
    setExpenseToEdit(expense);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="grid gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col gap-6"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/properties" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
              <ChevronLeft className="h-4 w-4" />
              <span>Retour aux biens</span>
            </Link>
          </motion.div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-3XL text-3xl">{property.name}</h1>
              <p className="text-muted-foreground">{property.address}</p>
            </div>
            <div className="flex items-center gap-6">
              {property.latitude && property.longitude && 
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <PropertyWeather latitude={property.latitude} longitude={property.longitude} />
                </motion.div>
              }
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AddExpenseDialog propertyId={property.id} onExpenseAdded={() => refetchExpenses()} expense={expenseToEdit} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02, 
              rotateY: 2,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
            }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Localisation</h2>
              <div className="h-[200px] w-full overflow-hidden rounded-lg">
                <PropertiesMap properties={[property]} />
              </div>
            </Card>
          </motion.div>

          <motion.div 
            variants={itemVariants}
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

          <motion.div 
            className="grid lg:grid-cols-2 gap-4 md:col-span-2"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
              }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dépenses</h2>
                {isLoadingExpenses ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <ExpensesList expenses={expenses || []} onExpenseDeleted={() => refetchExpenses()} onExpenseEdit={handleExpenseEdit} />
                )}
              </Card>
            </motion.div>

            {!isLoadingExpenses && expenses && (
              <motion.div 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
                }}
              >
                <Card className="p-6">
                  <ExpensesChart expenses={expenses} />
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PropertyDetail;
