
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";

interface RetailerDetailCardProps {
  title: string;
  icon: React.ReactNode;
  amount: number;
  subtitle: string;
  isAverage?: boolean;
}

export function RetailerDetailCard({ 
  title, 
  icon, 
  amount, 
  subtitle,
  isAverage = false 
}: RetailerDetailCardProps) {
  return (
    <Card className="p-6 h-full">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-bold mt-2">
            {formatCurrency(amount)}
            {isAverage && <span className="text-sm text-muted-foreground ml-1">/mois</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="bg-muted rounded-full p-2">
          {icon}
        </div>
      </div>
    </Card>
  );
}
