
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { SavingItem } from "../SavingItem";

interface SavingsContainerProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
    projet_id?: string;
  }>;
  onEdit: (saving: any) => void;
  onDelete: (saving: any) => void;
  showSavings: boolean;
}

export const SavingsContainer = ({
  monthlySavings,
  onEdit,
  onDelete,
  showSavings
}: SavingsContainerProps) => {
  const containerVariants = {
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      },
    },
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        when: "afterChildren",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={showSavings ? "visible" : "hidden"}
    >
      <AnimatePresence mode="wait" className="space-y-2">
        {monthlySavings.map((saving) => (
          <SavingItem
            key={saving.id}
            saving={saving}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
