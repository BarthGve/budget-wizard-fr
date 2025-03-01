
import { TableCell, TableRow } from "@/components/ui/table";
import { RecurringExpense, periodicityLabels } from "../types";
import { TableRowActions } from "../TableRowActions";
import { motion, AnimatePresence } from "framer-motion";

interface TableRowsProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
  isFirstVisit?: boolean;
}

export const TableRows = ({ expenses, onDeleteExpense, isFirstVisit = true }: TableRowsProps) => {
  // Animations conditionnelles
  const tableRowVariants = isFirstVisit ? {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 15,
      scale: 0.95
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.05
      }
    }),
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  } : {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  };

  return (
    <AnimatePresence mode="wait">
      {expenses.map((expense, index) => (
        <motion.tr 
          key={expense.id}
          className="bg-card dark:bg-card"
          custom={index}
          variants={tableRowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={isFirstVisit ? {
            scale: 1.01,
            backgroundColor: "rgba(var(--card-rgb), 0.8)",
            transition: { duration: 0.2 }
          } : undefined}
          style={isFirstVisit ? {
            transformStyle: "preserve-3d",
            perspective: "1000px",
            zIndex: expenses.length - index
          } : undefined}
        >
          <TableCell className="py-2">
            <div className="flex items-center gap-3">
              {expense.logo_url && (
                <motion.img
                  src={expense.logo_url}
                  alt={expense.name}
                  className="w-8 h-8 rounded-full object-contain"
                  initial={isFirstVisit ? { scale: 0.8, opacity: 0 } : false}
                  animate={isFirstVisit ? { scale: 1, opacity: 1 } : false}
                  transition={isFirstVisit ? { delay: index * 0.05 + 0.2, duration: 0.3 } : undefined}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              )}
              <span className="font-semibold">{expense.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-2">{expense.category}</TableCell>
          <TableCell className="py-2">{periodicityLabels[expense.periodicity]}</TableCell>
          <TableCell className="text-center py-2">{expense.amount.toLocaleString('fr-FR')} €</TableCell>
          <TableCell className="text-right py-2">
            <TableRowActions expense={expense} onDeleteExpense={onDeleteExpense} />
          </TableCell>
        </motion.tr>
      ))}
    </AnimatePresence>
  );
};
