
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Contributors = () => {
  // Données temporaires pour la démo
  const contributors = [
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
  ];

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
                  <div className="text-right">
                    <p className="font-medium">{contributor.totalContribution} €</p>
                    <p className="text-sm text-gray-500">
                      {contributor.percentageContribution}% du budget
                    </p>
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
