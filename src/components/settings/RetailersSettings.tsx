
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RetailerDialog } from "./retailers/RetailerDialog";
import { useRetailers } from "./retailers/useRetailers";
import { RetailersList } from "./retailers/RetailersList";
import { toast } from "sonner";

export const RetailersSettings = () => {
  const [open, setOpen] = useState(false);
  const { retailers, isLoading, refetchRetailers } = useRetailers();

  const handleRetailerSaved = async () => {
    await refetchRetailers();
    setOpen(false);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Enseignes</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos enseignes pour le suivi des dépenses
          </p>
        </div>
        <RetailerDialog 
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une enseigne
            </Button>
          }
          onRetailerSaved={handleRetailerSaved}
        />
      </div>
      <RetailersList />
    </div>
  );
};
