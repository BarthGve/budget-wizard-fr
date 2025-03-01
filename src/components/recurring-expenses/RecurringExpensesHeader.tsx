
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";

export const RecurringExpensesHeader = () => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
          Charges récurrentes
        </h1>
        <p className="text-muted-foreground">Gérez vos charges récurrentes et leurs échéances</p>
      </div>
      <RecurringExpenseDialog
        trigger={
          <Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle charge
          </Button>
        }
      />
    </motion.div>
  );
};
