import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Edit2, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  periodicity: "monthly" | "quarterly" | "yearly";
  debit_day: number;
  debit_month: number | null;
  created_at: string;
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

const ALL_CATEGORIES = "all_categories";
const ALL_PERIODICITIES = "all_periodicities";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [periodicityFilter, setPeriodicityFilter] = useState<string>(ALL_PERIODICITIES);
  const [sortField, setSortField] = useState<keyof RecurringExpense>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));

  const handleSort = (field: keyof RecurringExpense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === ALL_CATEGORIES || expense.category === categoryFilter;
    const matchesPeriodicity = periodicityFilter === ALL_PERIODICITIES || expense.periodicity === periodicityFilter;
    return matchesSearch && matchesCategory && matchesPeriodicity;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortField === "amount") {
      return (a[sortField] - b[sortField]) * multiplier;
    }
    return String(a[sortField]).localeCompare(String(b[sortField])) * multiplier;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[220px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Toutes les catégories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={periodicityFilter} onValueChange={setPeriodicityFilter}>
            <SelectTrigger className="w-[220px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Périodicité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PERIODICITIES}>Toutes les périodicités</SelectItem>
              {Object.entries(periodicityLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={sortField} onValueChange={(value: keyof RecurringExpense) => handleSort(value)}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nom</SelectItem>
            <SelectItem value="amount">Montant</SelectItem>
            <SelectItem value="created_at">Date de création</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow >
              <TableHead >Nom</TableHead>
              <TableHead >Catégorie</TableHead>
              <TableHead >Périodicité</TableHead>
              <TableHead >Prélèvement</TableHead>
              <TableHead >Montant</TableHead>
              <TableHead >Créé le</TableHead>
              <TableHead className=" text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="space-y-2">
            {sortedExpenses.map((expense) => (
              <TableRow 
                key={expense.id}
                className="rounded-xl border border-slate-200 bg-white p-4 pr-8 shadow-sm transition-colors ease-in-out hover:border-slate-400"
              >
                <TableCell className="rounded-l-lg">{expense.name}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{periodicityLabels[expense.periodicity]}</TableCell>
                <TableCell>{formatDebitDate(expense.debit_day, expense.debit_month, expense.periodicity)}</TableCell>
                <TableCell>{expense.amount.toLocaleString('fr-FR')} €</TableCell>
                <TableCell>{format(new Date(expense.created_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                <TableCell className="rounded-r-lg text-right">
                  <div className="flex justify-end gap-2">
                    <RecurringExpenseDialog
                      expense={expense}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
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

      <div className="text-sm text-muted-foreground">
        {filteredExpenses.length} résultat{filteredExpenses.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};
