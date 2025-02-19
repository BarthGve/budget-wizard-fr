
import { MoreVertical, PlusCircle, Trash2 } from "lucide-react";
import { useRetailers } from "./useRetailers";
import { Button } from "@/components/ui/button";
import { RetailerDialog } from "./RetailerDialog";
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
  const { retailers, isLoading: isLoadingRetailers, refetchRetailers } = useRetailers();
  const [showNewRetailerDialog, setShowNewRetailerDialog] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const handleSuccess = () => {
    setShowFinalConfirmation(false);
    setShowDeleteConfirmation(false);
    setSelectedRetailer(null);
    refetchRetailers();
  };

  const handleError = () => {
    setShowFinalConfirmation(false);
    setShowDeleteConfirmation(false);
    setSelectedRetailer(null);
  };

  const { deleteRetailer, isDeleting } = useDeleteRetailer(handleSuccess);

  const handleDelete = async () => {
    if (selectedRetailer) {
      try {
        await deleteRetailer(selectedRetailer);
      } catch (error) {
        handleError();
      }
    }
  };

  const handleInitialDelete = (retailerId: string) => {
    setSelectedRetailer(retailerId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setShowFinalConfirmation(false);
    setSelectedRetailer(null);
  };

  const currentRetailer = selectedRetailer ? retailers?.find(r => r.id === selectedRetailer) : null;

  if (isLoadingRetailers) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Liste des enseignes</h2>
        <Button onClick={() => setShowNewRetailerDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une enseigne
        </Button>
      </div>

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

      <RetailerDialog
        open={showNewRetailerDialog}
        onOpenChange={setShowNewRetailerDialog}
        onRetailerSaved={refetchRetailers}
      />

      <AlertDialog 
        open={showDeleteConfirmation} 
        onOpenChange={(open) => {
          if (!open) handleDeleteCancel();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Attention - Suppression d'enseigne</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Vous êtes sur le point de supprimer l'enseigne <strong>{currentRetailer?.name}</strong>.</p>
              <p className="font-medium text-destructive">Cette action supprimera également toutes les dépenses associées à cette enseigne.</p>
              <p>Êtes-vous sûr de vouloir continuer ?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setShowDeleteConfirmation(false);
                setShowFinalConfirmation(true);
              }}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog 
        open={showFinalConfirmation}
        onOpenChange={(open) => {
          if (!open) handleDeleteCancel();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation finale</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Cette action est <strong>irréversible</strong>.</p>
              <p>Toutes les dépenses associées à l'enseigne <strong>{currentRetailer?.name}</strong> seront définitivement supprimées.</p>
              <p>Confirmez-vous vouloir supprimer :</p>
              <ul className="list-disc list-inside pl-4 text-destructive">
                <li>L'enseigne {currentRetailer?.name}</li>
                <li>Toutes les dépenses associées</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
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
