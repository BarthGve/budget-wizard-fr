
import { useState } from "react";
import { NewContributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface AddContributorDialogProps {
  onAdd: (contributor: NewContributor) => void;
}

export const AddContributorDialog = ({ onAdd }: AddContributorDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newContributor, setNewContributor] = useState<NewContributor>({
    name: "",
    email: "",
    total_contribution: "",
  });

  const handleAdd = () => {
    onAdd(newContributor);
    setNewContributor({ name: "", email: "", total_contribution: "" });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md ">
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un contributeur</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau contributeur au budget
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={newContributor.name}
              onChange={(e) =>
                setNewContributor({
                  ...newContributor,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              type="email"
              value={newContributor.email}
              onChange={(e) =>
                setNewContributor({
                  ...newContributor,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contribution">Contribution (€)</Label>
            <Input
              id="contribution"
              type="number"
              value={newContributor.total_contribution}
              onChange={(e) =>
                setNewContributor({
                  ...newContributor,
                  total_contribution: e.target.value,
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setNewContributor({ name: "", email: "", total_contribution: "" });
              setIsOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
