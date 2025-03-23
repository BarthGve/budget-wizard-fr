
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
import { useState, useEffect } from "react";
import { DeleteRetailerConfirmDialog } from "./DeleteRetailerConfirmDialog";

export function RetailersList() {
  const { retailers, isLoading, refetchRetailers } = useRetailers();
  const { mutate: deleteRetailer, isPending: isDeleting } = useDeleteRetailer();
  const [retailerToDelete, setRetailerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Gestionnaire pour l'ouverture du dialogue de confirmation
  const handleDeleteClick = (retailerId: string, retailerName: string) => {
    setRetailerToDelete({ id: retailerId, name: retailerName });
    setIsConfirmDialogOpen(true);
  };

  // Gestionnaire pour la suppression effective de l'enseigne
  const handleConfirmDelete = () => {
    if (retailerToDelete) {
      console.log("🎯 Deleting retailer:", retailerToDelete.id);
      
      deleteRetailer(retailerToDelete.id, {
        onSuccess: () => {
          // Forcer un rafraîchissement explicite des données
          setTimeout(() => {
            refetchRetailers();
          }, 100);
          
          // Réinitialiser l'état du dialogue
          setIsConfirmDialogOpen(false);
          setRetailerToDelete(null);
        },
        onError: () => {
          // En cas d'erreur, réinitialiser également
          setIsConfirmDialogOpen(false);
          setRetailerToDelete(null);
        }
      });
    }
  };

  // Gestionnaire pour la fermeture du dialogue sans suppression
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsConfirmDialogOpen(false);
      if (!isDeleting) {
        setRetailerToDelete(null);
      }
    }
  };

  // Effet pour forcer un rafraîchissement périodique si en cours de suppression
  useEffect(() => {
    if (isDeleting) {
      const interval = setInterval(() => {
        refetchRetailers();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isDeleting, refetchRetailers]);

  if (isLoading) {
    return <div><StyledLoader/></div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableBody>
          {retailers.map((retailer) => (
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
          ))}
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
