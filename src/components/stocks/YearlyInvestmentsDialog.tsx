
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Investment } from "./types/investments";

interface YearlyInvestmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yearlyData: Array<{
    year: number;
    amount: number;
  }>;
}

interface ExtendedInvestment extends Investment {
  asset_name?: string;
  asset_symbol?: string;
  notes?: string;
}

export const YearlyInvestmentsDialog = ({
  open,
  onOpenChange,
  yearlyData
}: YearlyInvestmentsDialogProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [investments, setInvestments] = useState<ExtendedInvestment[]>([]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  useEffect(() => {
    if (open && yearlyData.length > 0) {
      // Sélectionner l'année la plus récente par défaut
      const latestYear = [...yearlyData].sort((a, b) => b.year - a.year)[0]?.year;
      setSelectedYear(latestYear);
    } else {
      setSelectedYear(null);
    }
  }, [open, yearlyData]);
  
  useEffect(() => {
    if (selectedYear) {
      loadInvestmentsForYear(selectedYear);
    }
  }, [selectedYear]);
  
  const loadInvestmentsForYear = async (year: number) => {
    try {
      const startDate = new Date(year, 0, 1).toISOString();
      const endDate = new Date(year, 11, 31).toISOString();
      
      const { data, error } = await supabase
        .from("stock_investments")
        .select(`
          *,
          stock_assets (
            id,
            name,
            symbol
          )
        `)
        .gte('investment_date', startDate)
        .lte('investment_date', endDate)
        .order('investment_date', { ascending: false });
      
      if (error) throw error;
      
      // Formater les données avec les informations d'actifs
      const formattedData = data.map(inv => ({
        ...inv,
        asset_name: inv.stock_assets?.name,
        asset_symbol: inv.stock_assets?.symbol
      }));
      
      setInvestments(formattedData);
    } catch (error) {
      console.error("Erreur lors du chargement des investissements:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historique des investissements</DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          <div className="flex flex-wrap gap-2 mb-6">
            {yearlyData.sort((a, b) => b.year - a.year).map((yearData) => (
              <button
                key={yearData.year}
                onClick={() => setSelectedYear(yearData.year)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedYear === yearData.year
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {yearData.year} ({formatPrice(yearData.amount)})
              </button>
            ))}
          </div>
          
          {selectedYear && (
            <div>
              <h3 className="font-bold mb-2">Investissements de {selectedYear}</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Actif associé</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>
                          {format(new Date(investment.investment_date), 'dd MMMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>{formatPrice(investment.amount)}</TableCell>
                        <TableCell>
                          {investment.asset_name 
                            ? `${investment.asset_name} (${investment.asset_symbol})`
                            : "-"
                          }
                        </TableCell>
                        <TableCell>{investment.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                    {investments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Aucun investissement trouvé pour cette année
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
