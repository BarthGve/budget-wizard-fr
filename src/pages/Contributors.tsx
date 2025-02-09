
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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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

interface Contributor {
  id: number;
  name: string;
  email: string;
  avatar: string;
  totalContribution: number;
  percentageContribution: number;
}

const Contributors = () => {
  const { toast } = useToast();
  const [contributors, setContributors] = useState<Contributor[]>([
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean@example.com",
      avatar: "",
      totalContribution: 2500,
      percentageContribution: 50,
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie@example.com",
      avatar: "",
      totalContribution: 2500,
      percentageContribution: 50,
    },
  ]);

  const [editingContributor, setEditingContributor] = useState<Contributor | null>(
    null
  );
  const [newContributor, setNewContributor] = useState({
    name: "",
    email: "",
    totalContribution: "",
  });

  const handleAddContributor = () => {
    const contribution = parseFloat(newContributor.totalContribution);
    if (!newContributor.name || !newContributor.email || isNaN(contribution)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...contributors.map((c) => c.id)) + 1;
    const totalBudget = contributors.reduce(
      (sum, c) => sum + c.totalContribution,
      0
    ) + contribution;

    const updatedContributors = contributors.map((c) => ({
      ...c,
      percentageContribution: (c.totalContribution / totalBudget) * 100,
    }));

    setContributors([
      ...updatedContributors,
      {
        id: newId,
        name: newContributor.name,
        email: newContributor.email,
        avatar: "",
        totalContribution: contribution,
        percentageContribution: (contribution / totalBudget) * 100,
      },
    ]);

    setNewContributor({ name: "", email: "", totalContribution: "" });
    toast({
      title: "Succès",
      description: "Le contributeur a été ajouté avec succès",
    });
  };

  const handleUpdateContributor = () => {
    if (!editingContributor) return;

    const updatedContributors = contributors.map((c) =>
      c.id === editingContributor.id ? editingContributor : c
    );

    const totalBudget = updatedContributors.reduce(
      (sum, c) => sum + c.totalContribution,
      0
    );

    const contributorsWithUpdatedPercentages = updatedContributors.map((c) => ({
      ...c,
      percentageContribution: (c.totalContribution / totalBudget) * 100,
    }));

    setContributors(contributorsWithUpdatedPercentages);
    setEditingContributor(null);
    toast({
      title: "Succès",
      description: "Le contributeur a été mis à jour avec succès",
    });
  };

  const handleDeleteContributor = (id: number) => {
    const remainingContributors = contributors.filter((c) => c.id !== id);
    const totalBudget = remainingContributors.reduce(
      (sum, c) => sum + c.totalContribution,
      0
    );

    const updatedContributors = remainingContributors.map((c) => ({
      ...c,
      percentageContribution: (c.totalContribution / totalBudget) * 100,
    }));

    setContributors(updatedContributors);
    toast({
      title: "Succès",
      description: "Le contributeur a été supprimé avec succès",
    });
  };

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
                    value={newContributor.totalContribution}
                    onChange={(e) =>
                      setNewContributor({
                        ...newContributor,
                        totalContribution: e.target.value,
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
                      <AvatarImage src={contributor.avatar} />
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
                        {contributor.totalContribution} €
                      </p>
                      <p className="text-sm text-gray-500">
                        {contributor.percentageContribution.toFixed(1)}% du budget
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
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
                                  value={editingContributor.totalContribution}
                                  onChange={(e) =>
                                    setEditingContributor({
                                      ...editingContributor,
                                      totalContribution: parseFloat(e.target.value),
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
