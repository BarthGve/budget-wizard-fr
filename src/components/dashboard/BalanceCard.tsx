import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {Scale} from 'lucide-react'  
interface BalanceCardProps {
  balance: number;
  isMonthly?: boolean;
}
export const BalanceCard = ({
  balance,
  isMonthly = true
}: BalanceCardProps) => {
  return <Card>
      {/* <CardHeader className="py-[16px]">
        <div className="flex items-center gap-x-2">
          <Scale className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">Solde</CardTitle>
        </div>
        <CardDescription>Montant disponible</CardDescription>
      </CardHeader> */}
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-x-2">
          <CardTitle className="text-2xl">Solde</CardTitle>
          <Scale className="h-6 w-6 text-muted-foreground" />
      </div>
      <CardDescription>Montant disponible</CardDescription>
        </CardHeader>
      
      
      
      
      <CardContent>
        <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {balance.toFixed(0)} €
        </p>
      </CardContent>
    </Card>;
};