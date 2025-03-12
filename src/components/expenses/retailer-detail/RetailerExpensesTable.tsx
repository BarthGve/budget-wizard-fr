
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { ExpenseActionsDropdown } from "@/components/recurring-expenses/dialogs/ExpenseActionsDropdown";
import { TablePagination } from "@/components/recurring-expenses/table/TablePagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Calendar, Euro, MessageSquareText, ChevronRight, TableIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onViewDetails?: (expense: Expense) => void;
  colorScheme?: "blue" | "purple" | "green";
  currentYear?: number;
}

export function RetailerExpensesTable({
  expenses,
  isLoading,
  onEditExpense,
  onDeleteExpense,
  onViewDetails,
  colorScheme = "blue",
  currentYear = new Date().getFullYear()
}: RetailerExpensesTableProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Réinitialiser la page actuelle lorsque les dépenses changent
  useEffect(() => {
    setCurrentPage(1);
  }, [expenses?.length]);

  // Couleurs selon le schéma choisi
  const colors = {
    blue: {
      highlight: "bg-blue-50 dark:bg-blue-950/30",
      hover: "hover:bg-blue-50/80 dark:hover:bg-blue-950/20",
      accentText: "text-blue-700 dark:text-blue-400",
      accentBg: "bg-blue-100 dark:bg-blue-900/40",
      sortIcon: "text-blue-400 dark:text-blue-500",
      badge: "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400",
      headerBg: "text-blue-900 dark:text-blue-300",
      amountText: "text-blue-700 dark:text-blue-400",
      gradientFrom: "from-blue-400",
      gradientVia: "via-blue-300",
      lightBorder: "border-blue-100",
      darkBorder: "dark:border-blue-800/50",
      lightCardBg: "bg-white",
      darkCardBg: "dark:bg-gray-800/90",
      cardHeaderText: "text-blue-700",
      cardHeaderTextDark: "dark:text-blue-300",
      cardDescText: "text-blue-600/80",
      cardDescTextDark: "dark:text-blue-400/90",
      iconBgLight: "bg-blue-100",
      iconBgDark: "dark:bg-blue-800/40",
      iconLight: "text-blue-600",
      iconDark: "dark:text-blue-400",
      counterBgLight: "bg-blue-100/70",
      counterBgDark: "dark:bg-blue-900/30",
      footerBgLight: "bg-blue-50/30",
      footerBgDark: "dark:bg-blue-900/10"
    },
    purple: {
      highlight: "bg-purple-50 dark:bg-purple-950/30",
      hover: "hover:bg-purple-50/80 dark:hover:bg-purple-950/20",
      accentText: "text-purple-700 dark:text-purple-400",
      accentBg: "bg-purple-100 dark:bg-purple-900/40",
      sortIcon: "text-purple-400 dark:text-purple-500",
      badge: "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400",
      headerBg: "text-purple-900 dark:text-purple-300",
      amountText: "text-purple-700 dark:text-purple-400",
      gradientFrom: "from-purple-400",
      gradientVia: "via-purple-300",
      lightBorder: "border-purple-100",
      darkBorder: "dark:border-purple-800/50",
      lightCardBg: "bg-white",
      darkCardBg: "dark:bg-gray-800/90",
      cardHeaderText: "text-purple-700",
      cardHeaderTextDark: "dark:text-purple-300",
      cardDescText: "text-purple-600/80",
      cardDescTextDark: "dark:text-purple-400/90",
      iconBgLight: "bg-purple-100",
      iconBgDark: "dark:bg-purple-800/40",
      iconLight: "text-purple-600",
      iconDark: "dark:text-purple-400",
      counterBgLight: "bg-purple-100/70",
      counterBgDark: "dark:bg-purple-900/30",
      footerBgLight: "bg-purple-50/30",
      footerBgDark: "dark:bg-purple-900/10"
    },
    green: {
      highlight: "bg-green-50 dark:bg-green-950/30",
      hover: "hover:bg-green-50/80 dark:hover:bg-green-950/20",
      accentText: "text-green-700 dark:text-green-400",
      accentBg: "bg-green-100 dark:bg-green-900/40",
      sortIcon: "text-green-400 dark:text-green-500",
      badge: "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400",
      headerBg: "text-green-900 dark:text-green-300",
      amountText: "text-green-700 dark:text-green-400",
      gradientFrom: "from-green-400",
      gradientVia: "via-green-300",
      lightBorder: "border-green-100",
      darkBorder: "dark:border-green-800/50",
      lightCardBg: "bg-white",
      darkCardBg: "dark:bg-gray-800/90",
      cardHeaderText: "text-green-700",
      cardHeaderTextDark: "dark:text-green-300",
      cardDescText: "text-green-600/80",
      cardDescTextDark: "dark:text-green-400/90",
      iconBgLight: "bg-green-100",
      iconBgDark: "dark:bg-green-800/40",
      iconLight: "text-green-600",
      iconDark: "dark:text-green-400",
      counterBgLight: "bg-green-100/70",
      counterBgDark: "dark:bg-green-900/30",
      footerBgLight: "bg-green-50/30",
      footerBgDark: "dark:bg-green-900/10"
    }
  };
  
  const currentColors = colors[colorScheme];
  
  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc'); // Default to descending when changing columns
    }
  };

  // Tri des dépenses
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  
  if (isLoading) {
    return (
      <Card className={cn(
        "border shadow-sm overflow-hidden relative",
        currentColors.lightCardBg, currentColors.lightBorder,
        currentColors.darkCardBg, currentColors.darkBorder
      )}>
        <CardHeader className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className={cn(
                "text-xl font-semibold flex items-center gap-2",
                currentColors.cardHeaderText,
                currentColors.cardHeaderTextDark
              )}>
                <div className={cn(
                  "p-1.5 rounded",
                  currentColors.iconBgLight,
                  currentColors.iconBgDark
                )}>
                  <TableIcon className={cn(
                    "h-5 w-5",
                    currentColors.iconLight,
                    currentColors.iconDark
                  )} />
                </div>
                Historique des achats de l'année {currentYear}
              </CardTitle>
            </div>
            
            <Skeleton className="h-8 w-[150px]" />
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 p-0 px-4 pt-2 pb-4">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center px-2 py-4 rounded-md">
                <div className="flex gap-6 w-full">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-40" />
                  <div className="ml-auto">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (expenses.length === 0) {
    return (
      <Card className={cn(
        "border shadow-sm overflow-hidden relative",
        currentColors.lightCardBg, currentColors.lightBorder,
        currentColors.darkCardBg, currentColors.darkBorder
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
          currentColors.gradientFrom, currentColors.gradientVia, "to-transparent",
          "dark:opacity-10"
        )} />
        
        <CardHeader className="relative z-10">
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
              currentColors.cardHeaderText,
              currentColors.cardHeaderTextDark
            )}>
              <div className={cn(
                "p-1.5 rounded",
                currentColors.iconBgLight,
                currentColors.iconBgDark
              )}>
                <TableIcon className={cn(
                  "h-5 w-5",
                  currentColors.iconLight,
                  currentColors.iconDark
                )} />
              </div>
              Historique des achats de l'année {currentYear}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 text-center relative z-10">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Euro className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">Aucune dépense enregistrée</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Vous n'avez pas encore ajouté de dépenses pour ce commerçant.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = itemsPerPage === -1 ? sortedExpenses : sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden relative",
      currentColors.lightCardBg, currentColors.lightBorder,
      currentColors.darkCardBg, currentColors.darkBorder
    )}>
      <div className={cn(
        "absolute inset-0 opacity-5",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
        currentColors.gradientFrom, currentColors.gradientVia, "to-transparent",
        "dark:opacity-10"
      )} />
      
      <CardHeader className="relative z-10">
  <div className="flex justify-between items-start mb-4">
    <div className="flex items-center justify-between w-full">
      <div>
        <CardTitle className={cn(
          "text-xl font-semibold flex items-center gap-2",
          currentColors.cardHeaderText,
          currentColors.cardHeaderTextDark
        )}>
          <div className={cn(
            "p-1.5 rounded",
            currentColors.iconBgLight,
            currentColors.iconBgDark
          )}>
            <TableIcon className={cn(
              "h-5 w-5",
              currentColors.iconLight,
              currentColors.iconDark
            )} />
          </div>
          Historique des achats de l'année {currentYear}
        </CardTitle>
        <CardDescription className={cn(
          "mt-1 text-sm",
          currentColors.cardDescText,
          currentColors.cardDescTextDark
        )}>
          Consultez l'historique de vos dépenses pour ce commerçant
        </CardDescription>
      </div>
      
      <div className={cn(
        "text-sm px-2.5 py-1.5 rounded-md whitespace-nowrap",
        currentColors.counterBgLight, currentColors.accentText,
        currentColors.counterBgDark
      )}>
        {sortedExpenses.length} dépense{sortedExpenses.length !== 1 ? 's' : ''} au total
      </div>
    </div>
    
    <Select value={String(itemsPerPage)} onValueChange={value => {
      setItemsPerPage(Number(value));
      setCurrentPage(1);
    }}>
      <SelectTrigger className={cn(
        "w-[180px] h-8 text-xs", 
        `border-${colorScheme}-200 bg-${colorScheme}-50/50 text-${colorScheme}-700`,
        `dark:border-${colorScheme}-800/70 dark:bg-${colorScheme}-900/20 dark:text-${colorScheme}-300`
      )}>
        <SelectValue placeholder="Lignes par page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10 par page</SelectItem>
        <SelectItem value="25">25 par page</SelectItem>
        <SelectItem value="-1">Tout afficher</SelectItem>
      </SelectContent>
    </Select>
  </div>
</CardHeader>
      
      <CardContent className="relative z-10 p-0 overflow-x-auto">
        <div className={cn(
          "border-t border-b",
          currentColors.lightBorder,
          currentColors.darkBorder
        )}>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableHead className="w-[120px]">
                  <button 
                    onClick={() => handleSort('date')} 
                    className={cn(
                      "p-0 hover:bg-transparent flex items-center gap-1", 
                      currentColors.headerBg
                    )}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Date
                    {sortBy === 'date' && <ArrowUpDown className={cn("h-3 w-3 ml-1", currentColors.sortIcon)} />}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('amount')} 
                    className={cn(
                      "p-0 hover:bg-transparent flex items-center gap-1", 
                      currentColors.headerBg
                    )}
                  >
                    <Euro className="h-3.5 w-3.5 mr-1" />
                    Montant
                    {sortBy === 'amount' && <ArrowUpDown className={cn("h-3 w-3 ml-1", currentColors.sortIcon)} />}
                  </button>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <MessageSquareText className="h-3.5 w-3.5 mr-1" />
                    Commentaire
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense, index) => (
                <TableRow 
                  key={expense.id} 
                  className={cn(
                    "transition-colors",
                    onViewDetails && "cursor-pointer hover:cursor-pointer", 
                    currentColors.hover,
                    index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/20"
                  )}
                  onClick={() => onViewDetails && onViewDetails(expense)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center">
                      <div className={cn("w-8 h-8 rounded-md flex items-center justify-center mr-2", currentColors.accentBg)}>
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="font-medium">
                        {new Date(expense.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-semibold", currentColors.amountText)}>
                      {formatCurrency(expense.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {expense.comment ? (
                      <span className="text-sm">{expense.comment}</span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Aucun commentaire</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <ExpenseActionsDropdown 
                        onViewDetails={() => onViewDetails && onViewDetails(expense)} 
                        onEdit={() => onEditExpense(expense)} 
                        onDelete={() => onDeleteExpense(expense.id)} 
                      />
                      {onViewDetails && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className={cn(
          "justify-center py-4 relative z-10",
          currentColors.footerBgLight,
          currentColors.footerBgDark
        )}>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            colorScheme={colorScheme}
          />
        </CardFooter>
      )}
    </Card>
  );
}
