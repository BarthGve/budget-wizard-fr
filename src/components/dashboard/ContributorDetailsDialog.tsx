
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { Contributor } from "@/types/contributor";
import { ContributorStatsChart } from "./contributor-details/ContributorStatsChart";
import { ContributorMonthlyDetails } from "./contributor-details/ContributorMonthlyDetails";
import { ContributorDetailsHeader } from "./contributor-details/ContributorDetailsHeader";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContributorDetailsDialogProps {
  contributor: Contributor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ITEMS_PER_PAGE = 5;

export function ContributorDetailsDialog({ 
  contributor, 
  open, 
  onOpenChange 
}: ContributorDetailsDialogProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [currentCreditPage, setCurrentCreditPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Utilisation de useIsMobile pour la détection mobile
  const isMobile = useIsMobile();
  
  // Détection des appareils
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isSmallHeight = useMediaQuery("(max-height: 700px)");

  // Réinitialiser l'animation et les pages quand la modale s'ouvre
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      setCurrentExpensePage(1);
      setCurrentCreditPage(1);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-avatar-details", contributor.is_owner],
    enabled: contributor.is_owner && open,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  // Fetch monthly expenses and credits when modal is open
  const { data: monthlyData, isLoading: dataLoading } = useQuery({
    queryKey: ["contributor-monthly-data", contributor.name],
    enabled: open,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [{ data: expenses }, { data: credits }] = await Promise.all([
        supabase
          .from("recurring_expenses")
          .select("*")
          .eq("profile_id", user.id),
        supabase
          .from("credits")
          .select("*")
          .eq("profile_id", user.id)
          .eq("statut", "actif")
      ]);

      return {
        expenses: expenses || [],
        credits: credits || []
      };
    },
  });
  
  // Détermine si le défilement doit être activé
  const needsScrolling = isSmallHeight || isMobile || isTablet;

  const isLoading = profileLoading || dataLoading || isAnimating;

  const paginatedData = monthlyData ? {
    expenses: monthlyData.expenses.slice(
      (currentExpensePage - 1) * ITEMS_PER_PAGE,
      currentExpensePage * ITEMS_PER_PAGE
    ),
    credits: monthlyData.credits.slice(
      (currentCreditPage - 1) * ITEMS_PER_PAGE,
      currentCreditPage * ITEMS_PER_PAGE
    )
  } : null;

  const totalPages = {
    expenses: monthlyData ? Math.max(1, Math.ceil(monthlyData.expenses.length / ITEMS_PER_PAGE)) : 1,
    credits: monthlyData ? Math.max(1, Math.ceil(monthlyData.credits.length / ITEMS_PER_PAGE)) : 1
  };

  // Calculer les montants totaux pour afficher dans le graphique
  const totalExpenseAmount = monthlyData?.expenses.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalCreditAmount = monthlyData?.credits.reduce((sum, item) => sum + (item.montant_mensualite || 0), 0) || 0;
  
  // Calculer les parts du contributeur
  const expenseShare = totalExpenseAmount * (contributor.percentage_contribution / 100);
  const creditShare = totalCreditAmount * (contributor.percentage_contribution / 100);

  // Contenu partagé entre mobile et desktop
  const renderContent = () => (
    <div 
      ref={contentRef}
      className={cn(
        "relative",
        needsScrolling ? "max-h-[95vh] overflow-y-auto" : "",
        // Style pour la barre de défilement
        "scrollbar-thin scrollbar-track-transparent",
        isDarkTheme 
          ? "scrollbar-thumb-gray-600" 
          : "scrollbar-thumb-gray-300"
      )}
    >
      {/* Header - fixe en haut */}
      <div className={cn(
        "sticky top-0 z-10",
        isDarkTheme ? "bg-gray-900/95" : "bg-white/95",
        "backdrop-blur-sm"
      )}>
        <ContributorDetailsHeader
          name={contributor.name}
          isOwner={contributor.is_owner}
          avatarUrl={contributor.is_owner && profile ? profile.avatar_url : null}
          isDarkTheme={isDarkTheme}
        />
      </div>
      
      {/* Contenu qui sera défilable */}
      <div className="px-6 pb-6">
        {/* Loader */}
        {(profileLoading || dataLoading) && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className={cn(
              "animate-spin h-8 w-8", 
              isDarkTheme ? "text-indigo-400" : "text-indigo-600"
            )} />
          </div>
        )}
        
        {!profileLoading && !dataLoading && (
          <>
            {/* Section graphique */}
            <div 
              className={cn(
                "mt-4",
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
                "transition-all duration-500 ease-in-out"
              )}
            >
              <ContributorStatsChart
                expenseShare={expenseShare}
                creditShare={creditShare}
                expenseAmount={totalExpenseAmount}
                creditAmount={totalCreditAmount}
                isDarkTheme={isDarkTheme}
              />
            </div>
            
            {/* Section détails mensuels */}
            <div 
              className={cn(
                "mt-6",
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
                "transition-all duration-500 ease-in-out delay-200"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContributorMonthlyDetails
                  expenses={paginatedData?.expenses || []}
                  currentPage={currentExpensePage}
                  totalPages={totalPages.expenses}
                  contributorPercentage={contributor.percentage_contribution}
                  onPageChange={setCurrentExpensePage}
                  isDarkTheme={isDarkTheme}
                />
                {paginatedData && (
                  <ContributorMonthlyDetails
                    expenses={paginatedData.credits}
                    currentPage={currentCreditPage}
                    totalPages={totalPages.credits}
                    contributorPercentage={contributor.percentage_contribution}
                    onPageChange={setCurrentCreditPage}
                    type="credit"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Version mobile avec Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom"
          className={cn(
            "p-0 pt-4 sm:max-w-full border-0 rounded-t-xl h-[85vh]",
            isDarkTheme 
              ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900" 
              : "bg-gradient-to-br from-white via-gray-50 to-white",
          )}
          style={{
            boxShadow: isDarkTheme 
              ? "0 -10px 25px -5px rgba(0, 0, 0, 0.3)" 
              : "0 -10px 25px -5px rgba(0, 0, 0, 0.1)"
          }}
        >
          {/* Indicateur de glissement (drag indicator) */}
          <div className={cn(
            "w-12 h-1.5 rounded-full mx-auto mb-3",
            isDarkTheme ? "bg-gray-700" : "bg-gray-300"
          )} />
          
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 sm:max-w-[700px] w-[95vw]",
          "border-0 rounded-lg overflow-hidden",
          isDarkTheme 
            ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900" 
            : "bg-gradient-to-br from-white via-gray-50 to-white",
          needsScrolling ? "max-h-[95vh]" : ""
        )}
        style={{
          boxShadow: isDarkTheme 
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
        }}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
