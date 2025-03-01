
import { Card } from "@/components/ui/card";

export const EmptyCredits = () => {
  return (
    <Card className="p-4">
      <div className="text-center text-muted-foreground">
        Aucun crédit trouvé
      </div>
    </Card>
  );
};
