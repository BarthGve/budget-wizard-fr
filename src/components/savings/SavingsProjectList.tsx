
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsProject } from "@/types/savings-project";

interface SavingsProjectListProps {
  projects: SavingsProject[];
}

export const SavingsProjectList = ({ projects }: SavingsProjectListProps) => {
  return (
    <div className="space-y-4">
      <CardTitle className="py-4">Projets d'épargne</CardTitle>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="aspect-video relative">
              <img
                src={project.image_url || "/placeholder.svg"}
                alt={project.nom_projet}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2">{project.nom_projet}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Objectif:</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(project.montant_total)}
                  </p>
                </div>
                <Badge variant={project.added_to_recurring ? "default" : "outline"}>
                  {project.added_to_recurring ? "Actif" : "En attente"}
                </Badge>
              </div>
              {project.montant_mensuel && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {formatCurrency(project.montant_mensuel)} / mois
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Aucun projet d'épargne enregistré
          </p>
        )}
      </div>
    </div>
  );
};
