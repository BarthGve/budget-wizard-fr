
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { ExpenseActionsDropdown } from "@/components/recurring-expenses/dialogs/ExpenseActionsDropdown";
import { TablePagination } from "@/components/recurring-expenses/table/TablePagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Calendar, Euro, MessageSquareText, ChevronRight, TableIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  colorScheme?: "tertiary" | "purple" | "green";
  currentYear?: number;
}

export function RetailerExpensesTable({
  expenses,
  isLoading,
  onEditExpense,
  onDeleteExpense,
  onViewDetails,
  colorScheme = "tertiary",
  currentYear = new Date().getFullYear()
}: RetailerExpensesTableProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const isMobile = useIsMobile();

  useEffect(() => {
    setCurrentPage(1);
  }, [expenses?.length]);

  const colors = {
    tertiary: {
      highlight: "bg-tertiary-50 dark:bg-tertiary-950/30",
      hover: "hover:bg-tertiary-50/80 dark:hover:bg-tertiary-950/20",
      accentText: "text-tertiary-700 dark:text-tertiary-400",
      accentBg: "bg-tertiary-100 dark:bg-tertiary-900/40",
      sortIcon: "text-tertiary-400 dark:text-tertiary-500",
      badge: "border-tertiary-200 text-tertiary-700 dark:border-tertiary-800 dark:text-tertiary-400",
      headerBg: "text-tertiary-900 dark:text-tertiary-300",
      amountText: "text-tertiary-700 dark:text-tertiary-400",
      gradientFrom: "from-tertiary-400",
      gradientVia: "via-tertiary-300",
      lightBorder: "border-tertiary-100",
      darkBorder: "dark:border-tertiary-800/50",
      lightCardBg: "bg-white",
      darkCardBg: "dark:bg-gray-800/90",
      cardHeaderText: "text-tertiary-700",
      cardHeaderTextDark: "dark:text-tertiary-300",
      cardDescText: "text-tertiary-600/80",
      cardDescTextDark: "dark:text-tertiary-400/90",
      iconBgLight: "bg-tertiary-100",
      iconBgDark: "dark:bg-tertiary-800/40",
      iconLight: "text-tertiary-600",
      iconDark: "dark:text-tertiary-400",
      counterBgLight: "bg-tertiary-100/70",
      counterBgDark: "dark:bg-tertiary-900/30",
      footerBgLight: "bg-tertiary-50/30",
      footerBgDark: "dark:bg-tertiary-900/10"
    },
 
  };
  
  const currentColors = colors[colorScheme];
  
  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  
  // Version mobile : affichage des derniers achats
  if (isMobile) {
    if (isLoading) {
      return (
        <Card className={cn(
          "border shadow-lg overflow-hidden relative",
          currentColors.lightCardBg, currentColors.lightBorder,
          currentColors.darkCardBg, currentColors.darkBorder
        )}>
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className={cn(
              "text-base font-semibold flex items-center gap-2",
              currentColors.cardHeaderText,
              currentColors.cardHeaderTextDark
            )}>
              <div className={cn(
                "p-1.5 rounded",
                currentColors.iconBgLight,
                currentColors.iconBgDark
              )}>
                <Clock className={cn(
                  "h-4 w-4",
                  currentColors.iconLight,
                  currentColors.iconDark
                )} />
              </div>
              Derniers achats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between items-center px-2 py-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }
    
    if (expenses.length === 0) {
      return (
        <Card className={cn(
          "border shadow-lg overflow-hidden relative",
          currentColors.lightCardBg, currentColors.lightBorder,
          currentColors.darkCardBg, currentColors.darkBorder
        )}>
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className={cn(
              "text-base font-semibold flex items-center gap-2",
              currentColors.cardHeaderText,
              currentColors.cardHeaderTextDark
            )}>
              <div className={cn(
                "p-1.5 rounded",
                currentColors.iconBgLight,
                currentColors.iconBgDark
              )}>
                <Clock className={cn(
                  "h-4 w-4",
                  currentColors.iconLight,
                  currentColors.iconDark
                )} />
              </div>
              Derniers achats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-center py-6">
            <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Euro className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Aucune dépense enregistrée
            </p>
          </CardContent>
        </Card>
      );
    }
    
    // Récupérer les 5 dernières dépenses
    const latestExpenses = sortedExpenses.slice(0, 5);
    
    return (
      <Card className={cn(
        "border shadow-lg overflow-hidden relative",
        currentColors.lightCardBg, currentColors.lightBorder,
        currentColors.darkCardBg, currentColors.darkBorder
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
          currentColors.gradientFrom, currentColors.gradientVia, "to-transparent",
          "dark:opacity-10"
        )} />
        
        <CardHeader className="relative z-10 pb-2">
          <CardTitle className={cn(
            "text-base font-semibold flex items-center gap-2",
            currentColors.cardHeaderText,
            currentColors.cardHeaderTextDark
          )}>
            <div className={cn(
              "p-1.5 rounded",
              currentColors.iconBgLight,
              currentColors.iconBgDark
            )}>
              <Clock className={cn(
                "h-4 w-4",
                currentColors.iconLight,
                currentColors.iconDark
              )} />
            </div>
            Derniers achats
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-1.5 pt-1 pb-3">
          {latestExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className={cn(
                "flex justify-between items-center px-3 py-2.5 rounded-md",
                "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              )}
              onClick={() => onViewDetails && onViewDetails(expense)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", currentColors.accentBg)}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <span className="text-sm">
                  {format(new Date(expense.date), "d MMM yyyy", { locale: fr })}
                </span>
              </div>
              <span className={cn("font-semibold text-sm", currentColors.amountText)}>
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  // Version desktop : affichage du tableau complet
  if (isLoading) {
    return (
      <Card className={cn(
        "border shadow-lg overflow-hidden relative",
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
        "border shadow-lg overflow-hidden relative",
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

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = itemsPerPage === -1 ? sortedExpenses : sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  return (
    <Card className={cn(
      "border shadow-lg overflow-hidden relative",
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
        <div className="flex justify-between items-start ">
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
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "text-sm px-2.5 py-1.5 rounded-md whitespace-nowrap",
              currentColors.counterBgLight, currentColors.accentText,
              currentColors.counterBgDark
            )}>
              {sortedExpenses.length} dépense{sortedExpenses.length !== 1 ? 's' : ''} au total
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
