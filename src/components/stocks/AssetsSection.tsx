
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AssetDialog, assetTypes } from "./AssetDialog";
import { Asset, AssetWithValueData } from "./types/assets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Créons une constante locale pour les types d'actifs au cas où l'import ne fonctionnerait pas correctement
const assetTypesList = [
  { value: "action", label: "Action" },
  { value: "etf", label: "ETF" },
  { value: "obligation", label: "Obligation" },
  { value: "crypto", label: "Cryptomonnaie" },
  { value: "forex", label: "Forex" },
  { value: "matiere_premiere", label: "Matière première" },
  { value: "autre", label: "Autre" }
];

export const AssetsSection = () => {
  const [assets, setAssets] = useState<AssetWithValueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const { currentUser } = useCurrentUser();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const loadAssets = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("stock_assets")
        .select("*")
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      
      // Calculer les valeurs dérivées pour chaque actif
      const assetsWithData: AssetWithValueData[] = data.map(asset => {
        const currentValue = asset.current_price || asset.purchase_price;
        const totalValue = currentValue * asset.quantity;
        const initialValue = asset.purchase_price * asset.quantity;
        const profitLoss = totalValue - initialValue;
        const profitLossPercentage = initialValue > 0 
          ? (profitLoss / initialValue) * 100
          : 0;
          
        return {
          ...asset,
          totalValue,
          profitLoss,
          profitLossPercentage
        };
      });
      
      setAssets(assetsWithData);
    } catch (error) {
      console.error("Erreur lors du chargement des actifs:", error);
      toast.error("Impossible de charger les actifs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [currentUser]);

  const handleAddAsset = () => {
    setSelectedAsset(undefined);
    setDialogOpen(true);
  };
  
  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };
  
  const handleDeletePrompt = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteAsset = async () => {
    if (!assetToDelete) return;
    
    try {
      const { error } = await supabase
        .from("stock_assets")
        .delete()
        .eq("id", assetToDelete.id);
      
      if (error) throw error;
      
      toast.success("Actif supprimé avec succès");
      loadAssets();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer l'actif");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Titre et bouton sur la même ligne */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-fade-in">
            Mes actifs
          </h2>
          <p className="text-muted-foreground">
            Suivez la performance de votre portefeuille financier
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={handleAddAsset}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un actif
          </Button>
        </motion.div>
      </div>

      {/* Liste des actifs */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>
              Vos actifs financiers et leur performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : assets.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Vous n'avez pas encore d'actifs.</p>
                <Button 
                  variant="outline" 
                  onClick={handleAddAsset}
                  className="mt-4"
                >
                  Ajouter votre premier actif
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbole</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'achat</TableHead>
                      <TableHead>Prix d'achat</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Valeur totale</TableHead>
                      <TableHead>Gain/Perte</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => {
                      const assetTypeLabel = asset.asset_type 
                        ? assetTypesList.find(t => t.value === asset.asset_type)?.label || asset.asset_type
                        : "Non défini";
                        
                      return (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.symbol}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{assetTypeLabel}</TableCell>
                          <TableCell>
                            {format(new Date(asset.purchase_date), 'dd MMM yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>{formatPrice(asset.purchase_price)}</TableCell>
                          <TableCell>{asset.quantity}</TableCell>
                          <TableCell>{formatPrice(asset.totalValue)}</TableCell>
                          <TableCell>
                            <span className={
                              asset.profitLoss > 0 
                                ? "text-green-600" 
                                : asset.profitLoss < 0 
                                  ? "text-red-600" 
                                  : ""
                            }>
                              {formatPrice(asset.profitLoss)} ({asset.profitLossPercentage.toFixed(2)}%)
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditAsset(asset)}
                                title="Modifier"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeletePrompt(asset)}
                                className="text-red-500 hover:text-red-600"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Dialog pour ajouter/modifier un actif */}
      <AssetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadAssets}
        assetToEdit={selectedAsset}
      />
      
      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement l'actif {assetToDelete?.name} ({assetToDelete?.symbol}).
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAsset} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
