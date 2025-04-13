
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RecurringExpense } from "./types";
import { MobileCategoryListSkeleton } from "./skeletons/MobileCategoryListSkeleton";

interface MobileCategoryListProps {
  expenses: RecurringExpense[];
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
  isLoading?: boolean;
}

export const MobileCategoryList = ({ 
  expenses, 
  selectedPeriod,
  isLoading = false
}: MobileCategoryListProps) => {
  const [categorizedExpenses, setCategorizedExpenses] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (!expenses) return;
    
    // Filtrer par période si nécessaire
    const filteredExpenses = selectedPeriod 
      ? expenses.filter(expense => expense.periodicity === selectedPeriod) 
      : expenses;
    
    // Calculer les totaux par catégorie
    const categories = filteredExpenses.reduce((acc, expense) => {
      if (!expense.category) return acc;
      
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    setCategorizedExpenses(categories);
  }, [expenses, selectedPeriod]);
  
  if (isLoading) {
    return <MobileCategoryListSkeleton />;
  }
  
  // Si aucune dépense ou aucune catégorie
  if (Object.keys(categorizedExpenses).length === 0) {
    return (
      <Card className="p-4 text-center my-4">
        <p className="text-muted-foreground">
          {selectedPeriod 
            ? `Aucune charge ${selectedPeriod === 'monthly' ? 'mensuelle' : selectedPeriod === 'quarterly' ? 'trimestrielle' : 'annuelle'} trouvée.`
            : "Aucune charge récurrente trouvée."}
        </p>
      </Card>
    );
  }
  
  // Trier les catégories par montant décroissant
  const sortedCategories = Object.entries(categorizedExpenses)
    .sort(([, amountA], [, amountB]) => amountB - amountA);
  
  return (
    <motion.div
      className="space-y-4 my-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Répartition par catégorie</h3>
        <span className="text-xs text-muted-foreground">
          {sortedCategories.length} {sortedCategories.length > 1 ? 'catégories' : 'catégorie'}
        </span>
      </div>
      
      {sortedCategories.map(([category, amount], index) => (
        <Card key={category} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-${index % 2 === 0 ? 'tertiary' : 'secondary'}-100 dark:bg-${index % 2 === 0 ? 'tertiary' : 'secondary'}-900/30`}>
                  <span className="text-lg">{getCategoryEmoji(category)}</span>
                </div>
                <div>
                  <h4 className="font-medium">{category}</h4>
                  <p className="text-xs text-muted-foreground">
                    {getExpensesCount(expenses, category, selectedPeriod)} charge{getExpensesCount(expenses, category, selectedPeriod) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <p className="font-semibold">{amount.toLocaleString('fr-FR')} €</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};

// Fonction utilitaire pour obtenir un emoji par catégorie
function getCategoryEmoji(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('maison') || lowerCategory.includes('logement')) return '🏠';
  if (lowerCategory.includes('voiture') || lowerCategory.includes('transport')) return '🚗';
  if (lowerCategory.includes('assurance')) return '🛡️';
  if (lowerCategory.includes('santé')) return '🏥';
  if (lowerCategory.includes('alimentation') || lowerCategory.includes('courses')) return '🛒';
  if (lowerCategory.includes('loisir')) return '🎮';
  if (lowerCategory.includes('abonnement')) return '📱';
  if (lowerCategory.includes('énergie') || lowerCategory.includes('électricité')) return '⚡';
  if (lowerCategory.includes('eau')) return '💧';
  if (lowerCategory.includes('internet') || lowerCategory.includes('telecom')) return '📶';
  if (lowerCategory.includes('impôt')) return '📊';
  if (lowerCategory.includes('enfant') || lowerCategory.includes('école')) return '👨‍👩‍👧‍👦';
  
  return '💰'; // Emoji par défaut
}

// Fonction pour compter le nombre de dépenses par catégorie
function getExpensesCount(expenses: RecurringExpense[], category: string, selectedPeriod: "monthly" | "quarterly" | "yearly" | null): number {
  const filteredExpenses = selectedPeriod 
    ? expenses.filter(e => e.periodicity === selectedPeriod && e.category === category)
    : expenses.filter(e => e.category === category);
  
  return filteredExpenses.length;
}
