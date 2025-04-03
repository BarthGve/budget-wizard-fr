
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PropertyHeader } from "@/components/properties/property-detail/PropertyHeader";
import { PropertyLocationCard } from "@/components/properties/property-detail/PropertyLocationCard";
import { PropertyDetailsCard } from "@/components/properties/property-detail/PropertyDetailsCard";
import { PropertyExpensesSection } from "@/components/properties/property-detail/PropertyExpensesSection";
import { PropertyDetailSkeleton } from "@/components/properties/property-detail/PropertyDetailSkeleton";
import { PropertyNotFound } from "@/components/properties/property-detail/PropertyNotFound";
import { usePropertyDetail } from "@/components/properties/property-detail/usePropertyDetail";

const PropertyDetail = () => {
  const {
    property,
    isLoadingProperty,
    expenses,
    isLoadingExpenses,
    refetchExpenses,
    expenseToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleExpenseEdit
  } = usePropertyDetail();

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

  if (isLoadingProperty) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    return <PropertyNotFound />;
  }

  return (
    <TooltipProvider>
      <motion.div 
        className="grid gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <PropertyHeader 
          property={property}
          refetchExpenses={refetchExpenses}
          expenseToEdit={expenseToEdit}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />

        <motion.div 
          className="grid md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          <PropertyLocationCard property={property} />
          <PropertyDetailsCard property={property} />
          
          <PropertyExpensesSection 
            expenses={expenses} 
            isLoadingExpenses={isLoadingExpenses}
            refetchExpenses={refetchExpenses}
            onExpenseEdit={handleExpenseEdit}
          />
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};

export default PropertyDetail;
