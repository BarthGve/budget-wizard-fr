
import { Card } from "@/components/ui/card";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { Retailer } from "./types";
import { RetailerDialog } from "./RetailerDialog";
import { useDeleteRetailer } from "./useDeleteRetailer";

interface RetailersListProps {
  retailers: Retailer[];
  onRetailerUpdated: () => void;
}

export function RetailersList({ retailers, onRetailerUpdated }: RetailersListProps) {
  const [retailerToDelete, setRetailerToDelete] = useState<Retailer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  
  const { deleteRetailer, isDeleting } = useDeleteRetailer({
    onSuccess: () => {
      setRetailerToDelete(null);
      onRetailerUpdated();
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {retailers.map((retailer) => (
        <Card key={retailer.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {retailer.logo_url && (
                <img
                  src={retailer.logo_url}
                  alt={retailer.name}
                  className="h-8 w-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span className="font-medium">{retailer.name}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRetailer(retailer);
                    setEditDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setRetailerToDelete(retailer)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}

      <RetailerDialog
        retailer={selectedRetailer || undefined}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedRetailer(null);
        }}
        onRetailerSaved={() => {
          setEditDialogOpen(false);
          setSelectedRetailer(null);
          onRetailerUpdated();
        }}
        trigger={<></>}
      />

      <AlertDialog 
        open={!!retailerToDelete} 
        onOpenChange={(open) => !open && setRetailerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'enseigne</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette enseigne ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => retailerToDelete && deleteRetailer(retailerToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
