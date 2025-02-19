
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
  const { retailers, isLoading: isLoadingRetailers } = useRetailers();
  const [initialDialogOpen, setInitialDialogOpen] = useState(false);
  const [finalDialogOpen, setFinalDialogOpen] = useState(false);
  const [selectedRetailerId, setSelectedRetailerId] = useState<string | null>(null);

  const resetState = () => {
    setInitialDialogOpen(false);
    setFinalDialogOpen(false);
    setSelectedRetailerId(null);
  };

  const { deleteRetailer, isDeleting } = useDeleteRetailer(resetState);

  const handleDelete = () => {
    if (selectedRetailerId) {
      deleteRetailer(selectedRetailerId);
    }
  };

  const currentRetailer = selectedRetailerId 
    ? retailers?.find(r => r.id === selectedRetailerId) 
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
                      onClick={() => {
                        setSelectedRetailerId(retailer.id);
                        setInitialDialogOpen(true);
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
        open={initialDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetState();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Attention - Suppression d'enseigne
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="space-y-2">
            Vous êtes sur le point de supprimer l'enseigne <strong>{currentRetailer?.name}</strong>.
            Cette action supprimera également toutes les dépenses associées à cette enseigne.
            Êtes-vous sûr de vouloir continuer ?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resetState}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setInitialDialogOpen(false);
                setFinalDialogOpen(true);
              }}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog 
        open={finalDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetState();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmation finale
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="space-y-2">
            Cette action est <strong>irréversible</strong>.
            Toutes les dépenses associées à l'enseigne <strong>{currentRetailer?.name}</strong> seront définitivement supprimées.
            
            <p className="mt-4">Confirmez-vous vouloir supprimer :</p>
            <ul className="list-disc list-inside pl-4 text-destructive">
              <li>L'enseigne {currentRetailer?.name}</li>
              <li>Toutes les dépenses associées</li>
            </ul>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resetState}>
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
