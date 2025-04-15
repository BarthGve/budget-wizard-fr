
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { NewContributor } from "@/types/contributor";
import { contributorDialogTheme } from "./theme";

interface ContributorFormContentProps {
  isSubmitting: boolean;
  progress: number;
  newContributor: NewContributor;
  onContributorChange: (contributor: NewContributor) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isDarkMode: boolean;
}

export const ContributorFormContent = ({
  isSubmitting,
  progress,
  newContributor,
  onContributorChange,
  onCancel,
  onSubmit,
  isDarkMode
}: ContributorFormContentProps) => {
  const colors = contributorDialogTheme;

  return (
    <form onSubmit={onSubmit}>
      {isSubmitting ? (
        <div className="space-y-4 py-5">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-quinary-500 dark:text-quinary-400" />
            <div className="text-center text-sm font-medium text-quinary-600 dark:text-quinary-400">
              Création du contributeur en cours...
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-2 w-full bg-quinary-100 dark:bg-gray-700"
            style={{
              "--progress-foreground": isDarkMode ? "#F59E0B" : "#F59E0B"
            } as React.CSSProperties}
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Nom
              </Label>
              <Input
                id="name"
                value={newContributor.name}
                onChange={(e) =>
                  onContributorChange({
                    ...newContributor,
                    name: e.target.value,
                  })
                }
                required
                placeholder="Nom du contributeur"
                className={cn(
                  colors.inputBorder, 
                  colors.ringFocus,
                  colors.inputBg
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Email (optionnel)
              </Label>
              <Input
                id="email"
                type="email"
                value={newContributor.email}
                onChange={(e) =>
                  onContributorChange({
                    ...newContributor,
                    email: e.target.value,
                  })
                }
                placeholder="adresse@email.com"
                className={cn(
                  colors.inputBorder, 
                  colors.ringFocus,
                  colors.inputBg
                )}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="contribution" 
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Contribution (€)
            </Label>
            <Input
              id="contribution"
              type="number"
              value={newContributor.total_contribution}
              onChange={(e) =>
                onContributorChange({
                  ...newContributor,
                  total_contribution: e.target.value,
                })
              }
              placeholder="Montant en euros"
              required
              className={cn(
                colors.inputBorder, 
                colors.ringFocus,
                colors.inputBg
              )}
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-3 mt-6">
        <Button 
          variant="outline" 
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        >
          Annuler
        </Button>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "text-white px-6 py-2 rounded-lg",
            colors.buttonBg
          )}
        >
          {isSubmitting ? "En cours..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};
