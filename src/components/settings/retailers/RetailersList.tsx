
import { MoreVertical, Trash2 } from "lucide-react";
import { useRetailers } from "./useRetailers";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [retailerToDelete, setRetailerToDelete] = useState<string | null>(null);

  const { mutate: deleteRetailer, isPending: isDeleting } = useDeleteRetailer(() => {
    setConfirmationOpen(false);
    setRetailerToDelete(null);
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const handleDelete = (retailerId: string) => {
    setRetailerToDelete(retailerId);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (retailerToDelete) {
      deleteRetailer(retailerToDelete);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setRetailerToDelete(null);
    }
    setConfirmationOpen(open);
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

      <AlertDialog open={confirmationOpen} onOpenChange={handleDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmation de suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              Voulez-vous vraiment supprimer cette enseigne ?
              
              <div className="text-destructive">
                Cette action supprimera également toutes les dépenses associées et ne peut pas être annulée.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
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
