import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ZeroIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ZeroIncomeDialog = ({ open, onOpenChange }: ZeroIncomeDialogProps) => {
  const navigate = useNavigate();

  const handleNavigateToContributors = () => {
    onOpenChange(false);
    navigate("/contributors");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Centrage de la modale */}
      <DialogContent
        className={`
          relative z-50 p-6 sm:max-w-md w-full
          bg-gradient-to-b from-indigo-100/40 via-white to-purple-50/40
          border border-indigo-200 dark:border-gray-700 shadow-lg rounded-lg
          `}
        /* Fixe et centre la modale dans l'écran */
        style={{
          position: "fixed", // Assurance d'être positionné de façon fixe
          top: "50%",        // Position centrale verticalement
          left: "50%",       // Position centrale horizontalement
          transform: "translate(-50%, -50%)", // Translation pour centrer en tenant compte de la taille
        }}
      >
        {/* Décoration subtile */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b 
          from-indigo-200/10 to-indigo-50/5 dark:from-indigo-900/10 
          dark:via-gray-800 to-gray-800 rounded-lg pointer-events-none"
        />

        <DialogHeader className="relative z-10 text-center">
          <DialogTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">
            🎉 Bienvenue sur Budget Wizard !
          </DialogTitle>
          <DialogDescription className="text-sm text-indigo-600/80 dark:text-indigo-400 mt-2">
            Nous avons remarqué que vous n’avez pas encore renseigné vos revenus.
            Cette information est essentielle pour une expérience personnalisée et des analyses budgétaires précises.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 relative z-10">
          <p className="text-sm text-indigo-700/90 dark:text-indigo-300">
            ✨ En ajoutant vos revenus, vous pourrez :
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground text-indigo-600 dark:text-indigo-400">
            <li>Planifier votre budget mensuel</li>
            <li>Fixer votre objectif d'épargne</li>
            <li>Évaluer votre liberté financière</li>
          </ul>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 mt-4 relative z-10">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            className="text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600/10 dark:hover:bg-gray-700"
          >
            Non merci
          </Button>
          <Button
            onClick={handleNavigateToContributors}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            🔥 C'est parti!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
