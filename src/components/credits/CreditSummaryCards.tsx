
import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Credit } from "./types";

interface CreditSummaryCardsProps {
  activeCredits: Credit[];
  repaidThisMonth: number;
  totalActiveMensualites: number;
  totalRepaidMensualitesThisMonth: number;
}

// Using explicit displayName to help with debugging re-renders
export const CreditSummaryCards = memo(({
  activeCredits,
  repaidThisMonth,
  totalActiveMensualites,
  totalRepaidMensualitesThisMonth,
}: CreditSummaryCardsProps) => {
  console.log("Rendering CreditSummaryCards");
  
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
            {repaidThisMonth} crédit(s) à échéance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRepaidMensualitesThisMonth.toLocaleString('fr-FR')} €
          </div>
          <div className="text-emerald-100 mt-2">
            Mensualités échues
          </div>
        </CardContent>
      </Card>
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimisé: Comparaison profonde des props pour éviter les re-renders inutiles
  return prevProps.activeCredits.length === nextProps.activeCredits.length &&
    prevProps.repaidThisMonth === nextProps.repaidThisMonth &&
    prevProps.totalActiveMensualites === nextProps.totalActiveMensualites &&
    prevProps.totalRepaidMensualitesThisMonth === nextProps.totalRepaidMensualitesThisMonth;
});

// Explicitly set display name for better debugging
CreditSummaryCards.displayName = "CreditSummaryCards";
