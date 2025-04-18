
import { Button } from "@/components/ui/button";
import { ClipboardEdit, Eye, EyeOff, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ChangelogHeaderProps {
  isAdmin: boolean;
  onCreateNew: () => void;
  hiddenCount?: number; 
  showHidden?: boolean;
  onToggleShowHidden?: () => void;
}

export const ChangelogHeader = ({ 
  isAdmin, 
  onCreateNew,
  hiddenCount = 0,
  showHidden = false,
  onToggleShowHidden
}: ChangelogHeaderProps) => {
  return (
    <div className="flex flex-col mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journal des modifications</h1>
          <p className="text-muted-foreground mt-1">
            Suivez les nouveautés et améliorations de l'application
          </p>
        </div>
        {isAdmin && (
          <Button onClick={onCreateNew} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entrée
          </Button>
        )}
      </div>
      
      {isAdmin && (
        <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 flex items-center space-x-2">
            {showHidden ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">
              {hiddenCount > 0 ? (
                `${hiddenCount} entrée${hiddenCount > 1 ? 's' : ''} cachée${hiddenCount > 1 ? 's' : ''}`
              ) : (
                "Aucune entrée cachée"
              )}
            </span>
            {hiddenCount > 0 && !showHidden && (
              <Badge variant="outline" className="text-xs">
                Non visible{hiddenCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {showHidden ? "Masquer cachées" : "Afficher cachées"}
            </span>
            <Switch
              checked={showHidden}
              onCheckedChange={onToggleShowHidden}
            />
          </div>
        </div>
      )}
    </div>
  );
};
