
import { useState, useEffect } from "react";
import { Contributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditContributorDialogProps {
  contributor: Contributor;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (contributor: Contributor) => void;
}

export const EditContributorDialog = ({
  contributor,
  isOpen,
  onOpenChange,
  onUpdate,
}: EditContributorDialogProps) => {
  const [editedContributor, setEditedContributor] = useState<Contributor>({...contributor});

  // Reset edited contributor when the contributor prop changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setEditedContributor({...contributor});
    }
  }, [contributor, isOpen]);

  const handleUpdate = () => {
    onUpdate(editedContributor);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le contributeur</DialogTitle>
          <DialogDescription>
            {contributor.is_owner 
              ? "Modifiez votre contribution au budget"
              : "Modifiez les informations du contributeur"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!contributor.is_owner && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  value={editedContributor.name}
                  onChange={(e) =>
                    setEditedContributor({
                      ...editedContributor,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editedContributor.email || ""}
                  onChange={(e) =>
                    setEditedContributor({
                      ...editedContributor,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="edit-contribution">
              {contributor.is_owner ? "Votre contribution (€)" : "Contribution (€)"}
            </Label>
            <Input
              id="edit-contribution"
              type="number"
              value={editedContributor.total_contribution}
              onChange={(e) =>
                setEditedContributor({
                  ...editedContributor,
                  total_contribution: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>
            {contributor.is_owner ? "Mettre à jour ma contribution" : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
