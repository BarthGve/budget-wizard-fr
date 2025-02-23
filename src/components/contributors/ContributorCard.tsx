
import { Contributor } from "@/types/contributor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useState, useEffect } from "react";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedContributor, setEditedContributor] = useState(contributor);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const initials = getInitials(contributor.name);
  const avatarColors = getAvatarColor(contributor.name, isDarkTheme);

  // Fetch profile avatar for owner
  const { data: profile } = useQuery({
    queryKey: ["profile-avatar", contributor.is_owner],
    enabled: contributor.is_owner,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const handleUpdate = () => {
    onEdit(editedContributor);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded-lg bg-card dark:bg-card">
      <div className="flex items-center space-x-4">
        <Avatar>
          {contributor.is_owner && profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={contributor.name} />
          ) : null}
          <AvatarFallback 
            style={{
              backgroundColor: avatarColors.background,
              color: avatarColors.text,
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{contributor.name}</h3>
          {contributor.email && (
            <p className="text-sm text-gray-500">{contributor.email}</p>
          )}
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
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
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
                        value={editedContributor.email}
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
          {!contributor.is_owner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Supprimer le contributeur
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce contributeur ? Cette
                    action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(contributor.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};
