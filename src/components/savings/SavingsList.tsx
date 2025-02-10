
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

interface SavingsListProps {
  monthlySavings: MonthlySaving[];
  onSavingDeleted: () => void;
}

export const SavingsList = ({ monthlySavings, onSavingDeleted }: SavingsListProps) => {
  const { toast } = useToast();

  const deleteMonthlySaving = async (id: string) => {
    const { error } = await supabase.from("monthly_savings").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le versement mensuel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Versement mensuel supprimé",
    });

    onSavingDeleted();
  };

  return (
    <>
      {monthlySavings.map((saving) => (
        <Card key={saving.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <CardTitle>{saving.name}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMonthlySaving(saving.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Versement mensuel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Montant mensuel:
              </span>
              <span className="text-lg font-bold">{saving.amount}€</span>
            </div>
            {saving.description && (
              <p className="text-sm text-muted-foreground">
                {saving.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
};
