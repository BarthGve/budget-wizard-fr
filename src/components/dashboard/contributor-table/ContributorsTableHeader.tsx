
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ContributorsTableHeader() {
  return (
    <CardHeader>
      <CardTitle classname="text-lg">Répartition des charges</CardTitle>
      <CardDescription>
        Détail des revenus et participations par contributeur
      </CardDescription>
    </CardHeader>
  );
}
