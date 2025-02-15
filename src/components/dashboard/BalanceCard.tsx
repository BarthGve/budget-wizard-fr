import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
interface BalanceCardProps {
  balance: number;
  isMonthly?: boolean;
}
export const BalanceCard = ({
  balance,
  isMonthly = true
}: BalanceCardProps) => {
  return <Card>
      <CardHeader className="py-[16px]">
        <CardTitle className="text-2xl">Solde</CardTitle>
        <CardDescription>Montant disponible</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-primary-xl font-bold ">
          {balance.toFixed(2)} €
        </p>
      </CardContent>
    </Card>;
};