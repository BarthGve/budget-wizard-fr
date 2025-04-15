
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsList } from "@/components/savings/SavingsList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  // Si on est sur mobile, on masque par défaut, sinon on utilise la valeur passée
  const [showMonthlySavings, setShowMonthlySavings] = useState(isMobile ? false : showInitial);
  const { theme } = useTheme();

  const toggleMonthlySavingsVisibility = () => {
    setShowMonthlySavings(prev => !prev);
  };

  return (
    <motion.div 
      className="flex-none mt-6 w-full px-2 md:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between p-2 md:p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-quaternary-500 via-quaternary-500 to-teal-400 bg-clip-text text-transparent dark:from-quaternary-400 dark:via-quaternary-400 dark:to-teal-300 animate-fade-in text-xl md:text-2xl">Versements mensuels</h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMonthlySavingsVisibility}
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            "text-gray-500 hover:text-quaternary-600",
            "dark:text-gray-400 dark:hover:text-quaternary-400"
          )}
        >
          {showMonthlySavings ? (
            <>
              Masquer
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Afficher ({monthlySavings?.length || 0})
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      <SavingsList 
        monthlySavings={monthlySavings || []} 
        onSavingDeleted={onSavingDeleted} 
        showSavings={showMonthlySavings} 
      />
    </motion.div>
  );
};
