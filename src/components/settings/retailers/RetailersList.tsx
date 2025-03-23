
import { MoreVertical, Trash2 } from "lucide-react";
import { useRetailers } from "./useRetailers";
import { Button } from "@/components/ui/button";
import { useDeleteRetailer } from "./useDeleteRetailer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StyledLoader from "@/components/ui/StyledLoader";
import { useState, useEffect, useCallback } from "react";
import { DeleteRetailerConfirmDialog } from "./DeleteRetailerConfirmDialog";

export function RetailersList() {
  const { retailers, isLoading, refetchRetailers } = useRetailers();
  const { mutate: deleteRetailer, isPending: isDeleting } = useDeleteRetailer();
  const [retailerToDelete, setRetailerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Gestionnaire pour l'ouverture du dialogue de confirmation
  const handleDeleteClick = useCallback((retailerId: string, retailerName: string) => {
    setRetailerToDelete({ id: retailerId, name: retailerName });
    setIsConfirmDialogOpen(true);
  }, []);

  // Gestionnaire pour la suppression effective de l'enseigne
  const handleConfirmDelete = useCallback(() => {
    if (retailerToDelete) {
      console.log("🎯 Deleting retailer:", retailerToDelete.id);
      
      deleteRetailer(retailerToDelete.id, {
        onSuccess: () => {
          console.log("Deletion successful, refreshing data");
          
          // Fermer d'abord le dialogue et réinitialiser l'état
          setIsConfirmDialogOpen(false);
          setRetailerToDelete(null);
          
          // Puis forcer un rafraîchissement avec un léger délai
          // pour s'assurer que les états sont bien mis à jour
          setTimeout(() => {
            refetchRetailers();
          }, 300);
        },
        onError: (error) => {
          console.error("Error during deletion:", error);
          
          // Réinitialiser également les états en cas d'erreur
          setIsConfirmDialogOpen(false);
          setRetailerToDelete(null);
          
          // Rafraîchir quand même pour s'assurer que l'UI est cohérente
          setTimeout(() => {
            refetchRetailers();
          }, 300);
        }
      });
    }
  }, [retailerToDelete, deleteRetailer, refetchRetailers]);

  // Gestionnaire pour la fermeture du dialogue sans suppression
  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setIsConfirmDialogOpen(false);
      // Ne réinitialiser retailerToDelete que si pas en cours de suppression
      if (!isDeleting) {
        setRetailerToDelete(null);
      }
    }
  }, [isDeleting]);

  // Effet pour forcer un rafraîchissement même si l'utilisateur ne ferme pas le dialogue
  useEffect(() => {
    // Si on n'est plus en cours de suppression et qu'on avait commencé une suppression
    if (!isDeleting && retailerToDelete && !isConfirmDialogOpen) {
      console.log("Deletion process completed, refreshing data");
      refetchRetailers();
      setRetailerToDelete(null);
    }
  }, [isDeleting, retailerToDelete, isConfirmDialogOpen, refetchRetailers]);

  // Forcer un rafraîchissement au montage du composant
  useEffect(() => {
    console.log("RetailersList mounted, ensuring fresh data");
    refetchRetailers();
    
    // Rafraîchir périodiquement pour s'assurer que les données sont à jour
    const intervalId = setInterval(() => {
      if (!isDeleting && !isConfirmDialogOpen) {
        console.log("Periodic refresh of retailers data");
        refetchRetailers();
      }
    }, 10000); // Toutes les 10 secondes
    
    return () => clearInterval(intervalId);
  }, [refetchRetailers, isDeleting, isConfirmDialogOpen]);

  if (isLoading) {
    return <div><StyledLoader/></div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableBody>
          {retailers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                Aucune enseigne disponible
              </TableCell>
            </TableRow>
          ) : (
            retailers.map((retailer) => (
              <TableRow key={retailer.id}>
                <TableCell className="text-base">{retailer.name}</TableCell>
                <TableCell>
                  {retailer.logo_url && (
                    <img 
                      src={retailer.logo_url} 
                      alt={retailer.name} 
                      className="w-8 h-8 rounded-full object-contain"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => handleDeleteClick(retailer.id, retailer.name)} 
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteRetailerConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleDialogClose}
        onConfirm={handleConfirmDelete}
        retailerName={retailerToDelete?.name || ""}
      />
    </div>
  );
}
