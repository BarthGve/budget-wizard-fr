
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsList } from "@/components/savings/SavingsList";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { ChevronDown, ChevronUp, HandCoins } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MonthlySavingsSectionProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }> | null;
  onSavingDeleted: () => void;
  onSavingAdded: () => void;
  showInitial?: boolean;
}

export const MonthlySavingsSection = ({ 
  monthlySavings, 
  onSavingDeleted, 
  onSavingAdded,
  showInitial = true
}: MonthlySavingsSectionProps) => {
  const [showMonthlySavings, setShowMonthlySavings] = useState(showInitial);

  const toggleMonthlySavingsVisibility = () => {
    setShowMonthlySavings(prev => !prev);
  };

  return (
    <motion.div 
      className="flex-none mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl">Versements mensuels</h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMonthlySavingsVisibility}
              className={cn(
                "transition-all duration-300 rounded-full hover:bg-primary/10", 
                showMonthlySavings ? "bg-primary/5" : ""
              )}
            >
              {showMonthlySavings ? 
                <ChevronUp className="h-4 w-4 transition-all duration-300 transform" /> : 
                <ChevronDown className="h-4 w-4 transition-all duration-300 transform" />
              }
            </Button>
          </motion.div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NewSavingDialog 
            onSavingAdded={onSavingAdded} 
            trigger={
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md p-2">
                <HandCoins className="mr-2 h-4 w-4" />
              </Button>
            } 
          />
        </motion.div>
      </div>
      <SavingsList 
        monthlySavings={monthlySavings || []} 
        onSavingDeleted={onSavingDeleted} 
        showSavings={showMonthlySavings} 
      />
    </motion.div>
  );
};
