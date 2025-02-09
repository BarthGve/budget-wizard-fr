
import { Contributor } from "@/types/contributor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

interface ContributorCardProps {
  contributor: Contributor;
  onEdit: (contributor: Contributor) => void;
  onDelete: (id: string) => void;
}

export const ContributorCard = ({
  contributor,
  onEdit,
  onDelete,
}: ContributorCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>
            {contributor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{contributor.name}</h3>
          <p className="text-sm text-gray-500">{contributor.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-medium">{contributor.total_contribution} €</p>
          <p className="text-sm text-gray-500">
            {contributor.percentage_contribution.toFixed(1)}% du budget
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!contributor.is_owner && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le contributeur</DialogTitle>
                    <DialogDescription>
                      Modifiez les informations du contributeur
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Nom</Label>
                      <Input
                        id="edit-name"
                        value={contributor.name}
                        onChange={(e) =>
                          onEdit({ ...contributor, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={contributor.email}
                        onChange={(e) =>
                          onEdit({ ...contributor, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-contribution">Contribution (€)</Label>
                      <Input
                        id="edit-contribution"
                        type="number"
                        value={contributor.total_contribution}
                        onChange={(e) =>
                          onEdit({
                            ...contributor,
                            total_contribution: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => onEdit(contributor)}>
                      Mettre à jour
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le contributeur</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer ce contributeur ? Cette
                      action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(contributor.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
