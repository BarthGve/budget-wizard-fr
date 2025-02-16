
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface InvestmentHistoryProps {
  data: Array<{
    year: number;
    amount: number;
  }>;
}

export const InvestmentHistory = ({ data }: InvestmentHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Investissements</CardTitle>
        <CardDescription>Évolution sur les 5 dernières années</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.slice(-5)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
   
              <XAxis dataKey="year" />
          
              <Tooltip 
                formatter={(value) => 
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2
                  }).format(value as number)
                }
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
