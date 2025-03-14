
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsList } from "@/components/savings/SavingsList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface MonthlySavingsSectionProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }> | null;
  onSavingDeleted: () => void;
  showInitial?: boolean;
}

export const MonthlySavingsSection = ({ 
  monthlySavings, 
  onSavingDeleted,
  showInitial = true
}: MonthlySavingsSectionProps) => {
  const [showMonthlySavings, setShowMonthlySavings] = useState(showInitial);
  const { theme } = useTheme();

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
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 bg-clip-text text-transparent dark:from-emerald-400 dark:via-green-400 dark:to-teal-300 animate-fade-in text-2xl">Versements mensuels</h2>
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
      </div>
      <SavingsList 
        monthlySavings={monthlySavings || []} 
        onSavingDeleted={onSavingDeleted} 
        showSavings={showMonthlySavings} 
      />
    </motion.div>
  );
};
