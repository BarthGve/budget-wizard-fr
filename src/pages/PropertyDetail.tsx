
// Import identique
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PropertyHeader } from "@/components/properties/property-detail/PropertyHeader";
import { PropertyLocationCard } from "@/components/properties/property-detail/PropertyLocationCard";
import { PropertyDetailsCard } from "@/components/properties/property-detail/PropertyDetailsCard";
import { PropertyExpensesSection } from "@/components/properties/property-detail/PropertyExpensesSection";
import { PropertyDetailSkeleton } from "@/components/properties/property-detail/PropertyDetailSkeleton";
import { PropertyNotFound } from "@/components/properties/property-detail/PropertyNotFound";
import { usePropertyDetail } from "@/components/properties/property-detail/usePropertyDetail";

/**
 * Page de détails d'une propriété - Design harmonisé glassmorphisme
 */
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

  // Animation du container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.07
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
        // Fond glass, shadow doux sur la page de détail
        className="w-full max-w-4xl mx-auto flex flex-col gap-4 md:gap-6 lg:gap-8
          bg-white/80 dark:bg-quaternary-900/40 backdrop-blur-xl rounded-3xl shadow-xl px-2 py-4 md:p-8
          mt-2 md:mt-4 mb-4 md:mb-8
          border border-white/30 dark:border-quaternary-900/40"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header harmonisé */}
        <PropertyHeader 
          property={property}
          refetchExpenses={refetchExpenses}
          expenseToEdit={expenseToEdit}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />

        {/* Cartes infos/localisation/dépenses harmonisées */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-2"
          variants={containerVariants}
        >
          <PropertyLocationCard property={property} />
          <PropertyDetailsCard property={property} />
        </motion.div>
        <PropertyExpensesSection 
          expenses={expenses} 
          isLoadingExpenses={isLoadingExpenses}
          refetchExpenses={refetchExpenses}
          onExpenseEdit={handleExpenseEdit}
        />
      </motion.div>
    </TooltipProvider>
  );
};

export default PropertyDetail;

