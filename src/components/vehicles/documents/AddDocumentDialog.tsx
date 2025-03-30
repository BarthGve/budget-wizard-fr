
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentUpload } from "@/hooks/vehicle-documents/upload";
import { VehicleDocumentCategory } from "@/types/vehicle-documents";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader2, Upload } from "lucide-react";
import { useVehicleDocuments } from "@/hooks/vehicle-documents";

export interface AddDocumentDialogProps {
  vehicleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentAdded?: () => void; // Callback pour la réussite de l'ajout
}

export const AddDocumentDialog = ({ 
  vehicleId, 
  open, 
  onOpenChange,
  onDocumentAdded
}: AddDocumentDialogProps) => {
  const { currentUser } = useCurrentUser();
  const { categories, isLoadingCategories } = useVehicleDocuments(vehicleId);
  const { addDocument, isAdding, isUploading } = useDocumentUpload(vehicleId, currentUser?.id);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryId("");
    setFile(null);
    setFileError(null);
  };
  
  // Gérer la fermeture du dialogue
  const handleOpenChange = (open: boolean) => {
    if (!open && !isAdding) {
      resetForm();
    }
    onOpenChange(open);
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!name) return;
    if (!categoryId) return;
    if (!file) {
      setFileError("Veuillez sélectionner un fichier");
      return;
    }
    
    // Soumettre le document
    const success = await addDocument({
      file,
      document: {
        vehicle_id: vehicleId,
        category_id: categoryId,
        name,
        description
      }
    });
    
    // Si l'ajout a réussi, fermer le dialogue et réinitialiser le formulaire
    if (success) {
      resetForm();
      // Appeler le callback si fourni
      if (onDocumentAdded) {
        onDocumentAdded();
      } else {
        onOpenChange(false);
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nom du document */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du document *</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Facture d'entretien, Carte grise, etc."
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle du document"
              rows={3}
            />
          </div>
          
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCategories ? (
                  <div className="p-2 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    <span className="text-sm">Chargement...</span>
                  </div>
                ) : (
                  categories?.map((category: VehicleDocumentCategory) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Fichier */}
          <div className="space-y-2">
            <Label htmlFor="file">Document *</Label>
            <Input 
              id="file"
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                setFile(selectedFile || null);
                setFileError(null); // Effacer l'erreur précédente
              }}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.txt"
              required
            />
            {fileError && (
              <p className="text-sm text-red-500">{fileError}</p>
            )}
            <p className="text-xs text-gray-500">
              Formats acceptés: PDF, Word, Excel, images, texte
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isAdding}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isAdding || !file || !name || !categoryId}
            >
              {isAdding ? (
                <>
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? "Chargement..." : "Traitement..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Ajouter le document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
