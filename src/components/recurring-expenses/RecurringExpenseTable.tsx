import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, Tags, Repeat, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecurringExpenseDialog } from "./RecurringExpenseDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  periodicity: "monthly" | "quarterly" | "yearly";
  debit_day: number;
  debit_month: number | null;
}

interface RecurringExpenseTableProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

const periodicityLabels = {
  monthly: "Mensuelle",
  quarterly: "Trimestrielle",
  yearly: "Annuelle"
};

const formatDebitDate = (debit_day: number, debit_month: number | null, periodicity: string) => {
  const day = debit_day.toString().padStart(2, '0');
  
  if (periodicity === "monthly") {
    return `Le ${day} de chaque mois`;
  } else {
    const monthName = new Date(0, debit_month! - 1).toLocaleString('fr-FR', { month: 'long' });
    return `Le ${day} ${monthName}`;
  }
};

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RecurringExpense;
    direction: "asc" | "desc";
  } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [periodicityFilter, setPeriodicityFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));
  const uniquePeriodicities = Array.from(new Set(expenses.map(expense => expense.periodicity)));

  const sortData = (data: RecurringExpense[]) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filterData = (data: RecurringExpense[]) => {
    return data.filter(expense => {
      const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || expense.category === categoryFilter;
      const matchesPeriodicity = !periodicityFilter || expense.periodicity === periodicityFilter;

      return matchesSearch && matchesCategory && matchesPeriodicity;
    });
  };

  const handleSort = (key: keyof RecurringExpense) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const filteredAndSortedData = sortData(filterData(expenses));
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une charge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Tags className="mr-2 h-4 w-4" />
              Catégories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
              Toutes les catégories
            </DropdownMenuItem>
            {uniqueCategories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Repeat className="mr-2 h-4 w-4" />
              Périodicité
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPeriodicityFilter(null)}>
              Toutes les périodicités
            </DropdownMenuItem>
            {uniquePeriodicities.map((periodicity) => (
              <DropdownMenuItem 
                key={periodicity} 
                onClick={() => setPeriodicityFilter(periodicity)}
              >
                {periodicityLabels[periodicity as keyof typeof periodicityLabels]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <Button variant="ghost" onClick={() => handleSort("name")}>
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead className="text-center">
        <Button variant="ghost" onClick={() => handleSort("category")}>
          Catégorie
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead className="text-center">
        <Button variant="ghost" onClick={() => handleSort("periodicity")}>
          Périodicité
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead className="text-center">Prélèvement</TableHead>
      <TableHead className="text-center">
        <Button variant="ghost" onClick={() => handleSort("amount")}>
          Montant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {paginatedData.map((expense) => (
      <TableRow key={expense.id}>
        <TableCell className="font-medium">{expense.name}</TableCell>
        <TableCell className="text-center">{expense.category}</TableCell>
        <TableCell className="text-center">{periodicityLabels[expense.periodicity]}</TableCell>
        <TableCell className="text-center">{formatDebitDate(expense.debit_day, expense.debit_month, expense.periodicity)}</TableCell>
        <TableCell className="text-center">{expense.amount} €</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <RecurringExpenseDialog
              expense={expense}
              trigger={
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la charge</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cette charge ? Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteExpense(expense.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredAndSortedData.length} résultat{filteredAndSortedData.length > 1 ? 's' : ''}</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>par page</span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => currentPage !== 1 && handlePageChange(1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>

            {/* Pages before current page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage > 3 && <PaginationEllipsis />}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Current page */}
            <PaginationItem>
              <PaginationLink isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {/* Pages after current page */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage < totalPages - 2 && <PaginationEllipsis />}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                onClick={() => currentPage !== totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => currentPage !== totalPages && handlePageChange(totalPages)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
