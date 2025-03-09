
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReceiptPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExpenseForm } from "./ExpenseForm";
import { useExpenseForm } from "./useExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { motion } from "framer-motion";

export function AddExpenseDialog({ onExpenseAdded, preSelectedRetailer, open, onOpenChange }: AddExpenseDialogProps) {
  const [showNoRetailerAlert, setShowNoRetailerAlert] = useState(false);
  const { retailers } = useRetailers();
  const navigate = useNavigate();
  const { handleSubmit } = useExpenseForm(onExpenseAdded);
  
  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values);
    if (success && onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleAddClick = () => {
    if (!retailers?.length && !preSelectedRetailer) {
      setShowNoRetailerAlert(true);
    } else if (onOpenChange) {
      onOpenChange(true);
    }
  };

  return (
    <>
      {!preSelectedRetailer && (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            onClick={handleAddClick} 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full shadow-md border-none px-5 h-10 font-medium transition-all duration-300"
          >
            <ReceiptPlus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
            Nouvelle dépense
          </Button>
        </motion.div>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] rounded-xl">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-xl font-bold text-gray-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <ReceiptPlus className="h-5 w-5 text-blue-600" />
                </div>
                <span>Ajouter une dépense</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm 
            onSubmit={onSubmit}
            preSelectedRetailer={preSelectedRetailer}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent className="rounded-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <span>Aucune enseigne disponible</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Vous devez d'abord créer une enseigne avant de pouvoir ajouter une dépense. 
              Souhaitez-vous créer une enseigne maintenant ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Non, plus tard
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setShowNoRetailerAlert(false);
                navigate("/settings", { state: { scrollTo: "retailers" } });
              }}
            >
              Oui, créer une enseigne
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
