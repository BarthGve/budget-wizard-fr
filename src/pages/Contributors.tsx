
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

interface Contributor {
  id: string;
  name: string;
  email: string;
  total_contribution: number;
  percentage_contribution: number;
  is_owner: boolean;
  profile_id: string;
}

const Contributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [newContributor, setNewContributor] = useState({
    name: "",
    email: "",
    total_contribution: "",
  });

  const fetchContributors = async () => {
    try {
      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setContributors(data || []);
    } catch (error: any) {
      console.error("Error fetching contributors:", error);
      toast.error("Erreur lors du chargement des contributeurs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  const handleAddContributor = async () => {
    const contribution = parseFloat(newContributor.total_contribution);
    if (!newContributor.name || !newContributor.email || isNaN(contribution)) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }

    try {
      // Get the current user's profile ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un contributeur");
        return;
      }

      // Calculate new percentage contributions
      const totalBudget = contributors.reduce(
        (sum, c) => sum + c.total_contribution,
        0
      ) + contribution;

      const { data: newContributorData, error: insertError } = await supabase
        .from("contributors")
        .insert([
          {
            name: newContributor.name,
            email: newContributor.email,
            total_contribution: contribution,
            percentage_contribution: (contribution / totalBudget) * 100,
            profile_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update percentages for all contributors
      const updatedContributors = contributors.map((c) => ({
        ...c,
        percentage_contribution: (c.total_contribution / totalBudget) * 100,
      }));

      await Promise.all(
        updatedContributors.map((c) =>
          supabase
            .from("contributors")
            .update({ percentage_contribution: c.percentage_contribution })
            .eq("id", c.id)
        )
      );

      setNewContributor({ name: "", email: "", total_contribution: "" });
      toast.success("Le contributeur a été ajouté avec succès");
      fetchContributors();
    } catch (error: any) {
      console.error("Error adding contributor:", error);
      toast.error("Erreur lors de l'ajout du contributeur");
    }
  };

  const handleUpdateContributor = async () => {
    if (!editingContributor) return;

    try {
      const totalBudget = contributors.reduce(
        (sum, c) =>
          sum +
          (c.id === editingContributor.id
            ? editingContributor.total_contribution
            : c.total_contribution),
        0
      );

      const updatedContributors = contributors.map((c) => ({
        ...c,
        percentage_contribution:
          (c.id === editingContributor.id
            ? editingContributor.total_contribution
            : c.total_contribution) /
          totalBudget *
          100,
      }));

      // Update the edited contributor
      const { error: updateError } = await supabase
        .from("contributors")
        .update({
          name: editingContributor.name,
          email: editingContributor.email,
          total_contribution: editingContributor.total_contribution,
          percentage_contribution: (editingContributor.total_contribution / totalBudget) * 100,
        })
        .eq("id", editingContributor.id);

      if (updateError) throw updateError;

      // Update percentages for all other contributors
      await Promise.all(
        updatedContributors
          .filter((c) => c.id !== editingContributor.id)
          .map((c) =>
            supabase
              .from("contributors")
              .update({ percentage_contribution: c.percentage_contribution })
              .eq("id", c.id)
          )
      );

      setEditingContributor(null);
      toast.success("Le contributeur a été mis à jour avec succès");
      fetchContributors();
    } catch (error: any) {
      console.error("Error updating contributor:", error);
      toast.error("Erreur lors de la mise à jour du contributeur");
    }
  };

  const handleDeleteContributor = async (id: string) => {
    try {
      const contributorToDelete = contributors.find((c) => c.id === id);
      if (!contributorToDelete) return;

      if (contributorToDelete.is_owner) {
        toast.error("Impossible de supprimer le propriétaire");
        return;
      }

      const { error: deleteError } = await supabase
        .from("contributors")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      const remainingContributors = contributors.filter((c) => c.id !== id);
      const totalBudget = remainingContributors.reduce(
        (sum, c) => sum + c.total_contribution,
        0
      );

      // Update percentages for remaining contributors
      await Promise.all(
        remainingContributors.map((c) =>
          supabase
            .from("contributors")
            .update({
              percentage_contribution: (c.total_contribution / totalBudget) * 100,
            })
            .eq("id", c.id)
        )
      );

      toast.success("Le contributeur a été supprimé avec succès");
      fetchContributors();
    } catch (error: any) {
      console.error("Error deleting contributor:", error);
      toast.error("Erreur lors de la suppression du contributeur");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contributeurs</h1>
            <p className="text-muted-foreground">
              Gérez les contributeurs du budget
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un contributeur
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
                  <Label htmlFor="email">Email</Label>
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
                <Button onClick={handleAddContributor}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des contributeurs</CardTitle>
            <CardDescription>
              Tous les contributeurs participant au budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributors.map((contributor) => (
                <div
                  key={contributor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
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
                      <p className="font-medium">
                        {contributor.total_contribution} €
                      </p>
                      <p className="text-sm text-gray-500">
                        {contributor.percentage_contribution.toFixed(1)}% du budget
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!contributor.is_owner && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingContributor(contributor)}
                              >
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
                              {editingContributor && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nom</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingContributor.name}
                                      onChange={(e) =>
                                        setEditingContributor({
                                          ...editingContributor,
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
                                      value={editingContributor.email}
                                      onChange={(e) =>
                                        setEditingContributor({
                                          ...editingContributor,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-contribution">
                                      Contribution (€)
                                    </Label>
                                    <Input
                                      id="edit-contribution"
                                      type="number"
                                      value={editingContributor.total_contribution}
                                      onChange={(e) =>
                                        setEditingContributor({
                                          ...editingContributor,
                                          total_contribution: parseFloat(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button onClick={handleUpdateContributor}>
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
                                <AlertDialogTitle>
                                  Supprimer le contributeur
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce contributeur ?
                                  Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteContributor(contributor.id)
                                  }
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contributors;
