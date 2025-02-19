
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { PropertyForm } from "./PropertyForm";

export const AddPropertyDialog = () => {
  const [open, setOpen] = useState(false);
  const { newProperty, setNewProperty, handleSubmit, isLoading } = usePropertyForm(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un bien
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un bien</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau bien à votre patrimoine immobilier
          </DialogDescription>
        </DialogHeader>
        
        <PropertyForm 
          newProperty={newProperty}
          onChange={setNewProperty}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            {isLoading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
