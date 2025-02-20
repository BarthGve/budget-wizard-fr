
import { MoreVertical, Trash2 } from "lucide-react";
import { useRetailers } from "./useRetailers";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useDeleteRetailer } from "./useDeleteRetailer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RetailersList() {
  const { retailers, isLoading } = useRetailers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [retailerToDelete, setRetailerToDelete] = useState<string | null>(null);

  const closeDialog = useCallback(() => {
    console.log("🔄 Closing dialog");
    setDialogOpen(false);
    setRetailerToDelete(null);
  }, []);

  const { mutate: deleteRetailer, isPending: isDeleting } = useDeleteRetailer(closeDialog);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const handleDelete = (retailerId: string) => {
    console.log("🎯 Opening delete dialog for retailer:", retailerId);
    setRetailerToDelete(retailerId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("✅ Confirming deletion for retailer:", retailerToDelete);
    if (retailerToDelete) {
      deleteRetailer(retailerToDelete);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {retailers.map((retailer) => (
            <TableRow key={retailer.id}>
              <TableCell>{retailer.name}</TableCell>
              <TableCell>
                {retailer.logo_url && (
                  <img 
                    src={retailer.logo_url} 
                    alt={retailer.name} 
                    className="h-8 w-8 object-contain"
                  />
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(retailer.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          console.log("🔄 Dialog state changing to:", open);
          if (!open) closeDialog();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmation de suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cette enseigne ?
            </AlertDialogDescription>
            <AlertDialogDescription className="text-destructive">
              Cette action supprimera également toutes les dépenses associées et ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
