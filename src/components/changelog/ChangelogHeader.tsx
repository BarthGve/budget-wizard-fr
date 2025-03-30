
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ChangelogHeaderProps {
  isAdmin: boolean;
  onCreateNew: () => void;
}

export const ChangelogHeader = ({ isAdmin, onCreateNew }: ChangelogHeaderProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Changelog
          </h1>
          <p className="text-muted-foreground mt-2">
            Suivez les dernières mises à jour et améliorations de notre application
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
    </div>
  );
};
