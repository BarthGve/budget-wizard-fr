
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ChangelogHeaderProps {
  isAdmin: boolean;
  onCreateNew: () => void;
}

export const ChangelogHeader = ({ isAdmin, onCreateNew }: ChangelogHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl text-primary font-bold">Changelog</h1>
        <p className="text-muted-foreground mt-2">
          Suivez les dernières mises à jour et améliorations
        </p>
      </div>
      {isAdmin && (
        <Button 
          onClick={onCreateNew}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Nouvelle entrée
        </Button>
      )}
    </div>
  );
};
