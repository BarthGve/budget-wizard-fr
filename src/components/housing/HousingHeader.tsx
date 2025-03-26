
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectRecurringExpenseDialog } from "./SelectRecurringExpenseDialog";
import { Edit, Plus } from "lucide-react";
import { useHousing } from "@/hooks/useHousing";
import { HousingForm } from "./HousingForm";

export const HousingHeader = () => {
  const { property } = useHousing();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b mb-6">
      <div>
        <h1 className="text-3xl font-bold">Mon Logement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les informations et charges liées à votre logement
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Modifier mon logement</DialogTitle>
            </DialogHeader>
            <HousingForm 
              initialData={property} 
              onSuccess={() => setEditDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog open={addExpenseDialogOpen} onOpenChange={setAddExpenseDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter une charge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Ajouter une charge récurrente</DialogTitle>
            </DialogHeader>
            <SelectRecurringExpenseDialog 
              onSuccess={() => setAddExpenseDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
