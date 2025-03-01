
import { TableCell, TableRow } from "@/components/ui/table";
import { RecurringExpense, periodicityLabels } from "../types";
import { TableRowActions } from "../TableRowActions";
import { motion, AnimatePresence } from "framer-motion";

interface TableRowsProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

export const TableRows = ({ expenses, onDeleteExpense }: TableRowsProps) => {
  // Animations
  const tableRowVariants = {
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
          whileHover={{
            scale: 1.01,
            backgroundColor: "rgba(var(--card-rgb), 0.8)",
            transition: { duration: 0.2 }
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            zIndex: expenses.length - index
          }}
        >
          <TableCell className="py-2">
            <div className="flex items-center gap-3">
              {expense.logo_url && (
                <motion.img
                  src={expense.logo_url}
                  alt={expense.name}
                  className="w-8 h-8 rounded-full object-contain"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
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
