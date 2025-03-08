
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const ContributionsHeader = () => {
  return (
    <div className="flex items-center justify-between pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contributions des utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les suggestions et idées soumises par les utilisateurs
        </p>
      </div>
    </div>
  );
};
