
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

type DialogState = {
  type: 'initial' | 'final' | null;
  retailerId: string | null;
};

export function RetailersList() {
  const { retailers, isLoading: isLoadingRetailers } = useRetailers();
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    retailerId: null
  });

  const { deleteRetailer, isDeleting } = useDeleteRetailer(() => {
    setDialogState({ type: null, retailerId: null });
  });

  const handleInitialDelete = (retailerId: string) => {
    setDialogState({ type: 'initial', retailerId });
  };

  const handleFinalConfirmation = () => {
    setDialogState(prev => ({ type: 'final', retailerId: prev.retailerId }));
  };

  const handleCancel = () => {
    setDialogState({ type: null, retailerId: null });
  };

  const handleDelete = () => {
    if (dialogState.retailerId) {
      deleteRetailer(dialogState.retailerId);
    }
  };

  const currentRetailer = dialogState.retailerId 
    ? retailers?.find(r => r.id === dialogState.retailerId) 
    : null;

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
                      onClick={() => handleInitialDelete(retailer.id)}
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

      {/* Initial Confirmation Dialog */}
      <AlertDialog 
        open={dialogState.type === 'initial'} 
        onOpenChange={(open) => !open && handleCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Attention - Suppression d'enseigne
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              Vous êtes sur le point de supprimer l'enseigne <strong>{currentRetailer?.name}</strong>.
              <br />
              Cette action supprimera également toutes les dépenses associées à cette enseigne.
              <br />
              Êtes-vous sûr de vouloir continuer ?
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleFinalConfirmation}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Final Confirmation Dialog */}
      <AlertDialog 
        open={dialogState.type === 'final'}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmation finale
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              Cette action est <strong>irréversible</strong>.
              <br />
              Toutes les dépenses associées à l'enseigne <strong>{currentRetailer?.name}</strong> seront définitivement supprimées.
              <br />
              Confirmez-vous vouloir supprimer :
              <ul className="list-disc list-inside pl-4 text-destructive mt-2">
                <li>L'enseigne {currentRetailer?.name}</li>
                <li>Toutes les dépenses associées</li>
              </ul>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Confirmer la suppression"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
