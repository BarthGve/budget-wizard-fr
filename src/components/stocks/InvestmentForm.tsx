
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvestmentFormProps {
  onSuccess: () => void;
}

export const InvestmentForm = ({ onSuccess }: InvestmentFormProps) => {
  const [investmentAmount, setInvestmentAmount] = useState("");

  const handleInvestmentSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const amount = parseFloat(investmentAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Montant invalide");
      }

      const { error } = await supabase
        .from("stock_investments")
        .insert({
          profile_id: user.id,
          amount,
          investment_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Investissement enregistré avec succès");
      setInvestmentAmount("");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvel Investissement</CardTitle>
        <CardDescription>Enregistrez votre investissement mensuel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="Montant investi"
          />
          <Button onClick={handleInvestmentSubmit}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
