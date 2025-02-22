
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Credit } from "./types";

interface CreditSummaryCardsProps {
  activeCredits: Credit[];
  repaidCredits: Credit[];
  totalActiveMensualites: number;
  totalRepaidMensualites: number;
  firstDayOfMonth: Date;
}

export const CreditSummaryCards = ({
  activeCredits,
  repaidCredits,
  totalActiveMensualites,
  totalRepaidMensualites,
  firstDayOfMonth,
}: CreditSummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle>Crédits actifs</CardTitle>
          <CardDescription className="text-violet-100">
            {activeCredits.length} crédit(s) en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalActiveMensualites.toLocaleString('fr-FR')} €
          </div>
          <div className="text-violet-100 mt-2">
            Mensualités totales
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white">
        <CardHeader>
          <CardTitle>Crédits remboursés ce mois</CardTitle>
          <CardDescription className="text-emerald-100">
            {repaidCredits.filter(credit => new Date(credit.date_derniere_mensualite) >= firstDayOfMonth).length} crédit(s) remboursé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRepaidMensualites.toLocaleString('fr-FR')} €
          </div>
          <div className="text-emerald-100 mt-2">
            Mensualités remboursées
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
