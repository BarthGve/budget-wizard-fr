
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Investment, CurrentYearInvestmentsDialogProps } from "./types/investments";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExtendedInvestment extends Investment {
  asset_name?: string;
  asset_symbol?: string;
  notes?: string;
}

export const CurrentYearInvestmentsDialog = ({
  open,
  onOpenChange,
  investments: initialInvestments,
  onSuccess
}: CurrentYearInvestmentsDialogProps) => {
  const [investments, setInvestments] = useState<ExtendedInvestment[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<ExtendedInvestment | null>(null);
  
  useEffect(() => {
    if (open && initialInvestments.length > 0) {
      loadInvestmentsWithAssetDetails();
    }
  }, [open, initialInvestments]);
  
  const loadInvestmentsWithAssetDetails = async () => {
    if (!initialInvestments.length) return;
    
    try {
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
        .in('id', initialInvestments.map(inv => inv.id))
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
      console.error("Erreur lors du chargement des détails d'investissements:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!investmentToDelete) return;
    
    try {
      const { error } = await supabase
        .from("stock_investments")
        .delete()
        .eq("id", investmentToDelete.id);
        
      if (error) throw error;
      
      toast.success("Investissement supprimé avec succès");
      setDeleteDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const handleDeletePrompt = (investment: ExtendedInvestment) => {
    setInvestmentToDelete(investment);
    setDeleteDialogOpen(true);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Investissements de l'année en cours</DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Total: {formatPrice(totalAmount)}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Actif associé</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeletePrompt(investment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {investments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Aucun investissement trouvé pour cette année
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet investissement de {formatPrice(investmentToDelete?.amount || 0)} ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
