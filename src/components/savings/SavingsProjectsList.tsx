
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PencilIcon, Trash2Icon, CircleDotDashed } from "lucide-react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SavingsProject {
  id: string;
  nom_projet: string;
  montant_total: number;
  montant_mensuel: number;
  date_estimee: string;
  mode_planification: "par_date" | "par_mensualite";
  added_to_recurring: boolean;
}

interface SavingsProjectsListProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
  onProjectEdit: (project: SavingsProject) => void;
}

export const SavingsProjectsList = ({ 
  projects, 
  onProjectDeleted,
  onProjectEdit 
}: SavingsProjectsListProps) => {
  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projets_epargne")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Projet supprimé avec succès");
      onProjectDeleted();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets d&apos;épargne</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{project.nom_projet}</h4>
                  <p className="text-sm text-muted-foreground">
                    Objectif : {formatCurrency(project.montant_total)}
                  </p>
                  {project.added_to_recurring && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <CircleDotDashed className="h-4 w-4" />
                      <span>Ajouté aux charges récurrentes</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(project.montant_mensuel)} / mois</p>
                    <p className="text-sm text-muted-foreground">
                      Fin estimée : {format(new Date(project.date_estimee), "MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onProjectEdit(project)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le projet</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce projet d&apos;épargne ?
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Aucun projet d&apos;épargne en cours
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
