
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SavingsProject {
  id: string;
  nom_projet: string;
  montant_total: number;
  montant_mensuel: number;
  date_estimee: string;
  mode_planification: "par_date" | "par_mensualite";
}

interface SavingsProjectsListProps {
  projects: SavingsProject[];
}

export const SavingsProjectsList = ({ projects }: SavingsProjectsListProps) => {
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
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(project.montant_mensuel)} / mois</p>
                  <p className="text-sm text-muted-foreground">
                    Fin estimée : {format(new Date(project.date_estimee), "MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-sm text-muted-foreground text-right">
                33% de l&apos;objectif atteint
              </p>
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
