
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";

interface DashboardPreferencesCardProps {
  children: ReactNode;
}

export const DashboardPreferencesCard = ({
  children
}: DashboardPreferencesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-5 w-5" />
          <CardTitle>Personnalisation du tableau de bord</CardTitle>
        </div>
        <CardDescription>
          Configurez quelles sections afficher sur votre tableau de bord
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};
