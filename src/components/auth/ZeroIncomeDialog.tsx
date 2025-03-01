
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
import { CreditCard } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Bienvenue sur Budget Wizard
          </DialogTitle>
          <DialogDescription>
            Nous avons remarqué que vous n'avez pas encore renseigné vos revenus. 
            Cette information est essentielle pour vous offrir une expérience personnalisée 
            et des analyses budgétaires précises.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            En renseignant vos revenus, vous pourrez :
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            <li>Visualiser votre budget mensuel</li>
            <li>Analyser vos dépenses par rapport à vos revenus</li>
            <li>Obtenir des suggestions d'épargne personnalisées</li>
          </ul>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
          <Button onClick={handleNavigateToContributors}>
            Renseigner mes revenus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
