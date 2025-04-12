import { Card } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditDialog } from "@/components/credits/CreditDialog";

export const EmptyCredits = () => {
  return (
    <Card
      className={cn(
        "text-center p-6 relative overflow-hidden transition-all duration-200",
        "border-dashed border-2 border-primary/20 bg-white/50",
        "dark:border-primary/30 dark:bg-background/30"
      )}
    >
      {/* Fond radial gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-5",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary/50 to-transparent",
          "dark:opacity-10 dark:from-primary dark:via-primary/60 dark:to-transparent"
        )}
      />

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div
          className={cn(
            "mb-4 rounded-full p-3",
            "bg-primary/10 text-primary"
          )}
        >
          <CreditCard className="h-6 w-6" />
        </div>

        <h3
          className={cn(
            "text-lg font-medium mb-2",
            "text-foreground"
          )}
        >
          Aucun crédit trouvé
        </h3>

        <p
          className={cn(
            "text-sm mb-6 max-w-md",
            "text-muted-foreground"
          )}
        >
          Vous n'avez pas encore de crédit enregistré. Ajoutez votre premier crédit pour commencer à suivre vos remboursements.
        </p>

        <CreditDialog
          trigger={
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "border-primary/30 text-primary bg-white hover:bg-primary/5",
                "dark:bg-background dark:hover:bg-primary/10 dark:text-primary dark:border-primary/40",
                "transition-all shadow-sm"
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un crédit
            </Button>
          }
        />
      </div>
    </Card>
  );
};