
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
  const { data: retailers, isLoading: isLoadingRetailers } = useRetailers();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [retailerToDelete, setRetailerToDelete] = useState<string | null>(null);

  const { mutate: deleteRetailer, isPending: isDeleting } = useDeleteRetailer(() => {
    setConfirmationOpen(false);
    setRetailerToDelete(null);
  });

  if (isLoadingRetailers) {
    return <div>Chargement...</div>;
  }

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
          {retailers?.map((retailer) => (
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
                      onClick={() => {
                        setRetailerToDelete(retailer.id);
                        setConfirmationOpen(true);
                      }}
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
        open={confirmationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmationOpen(false);
            setRetailerToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmation de suppression
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <p>Voulez-vous vraiment supprimer cette enseigne ?</p>
            <p className="text-destructive mt-2">
              Cette action supprimera également toutes les dépenses associées et ne peut pas être annulée.
            </p>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setConfirmationOpen(false);
              setRetailerToDelete(null);
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (retailerToDelete) {
                  deleteRetailer(retailerToDelete);
                }
              }}
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
