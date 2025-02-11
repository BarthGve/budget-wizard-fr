
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { PropertyForm } from "./PropertyForm";
import { useColorPalette } from "@/hooks/useColorPalette";
import { Property } from "@/types/property";
import { useEditProperty } from "@/hooks/useEditProperty";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EditPropertyDialogProps {
  property: Property;
}

export const EditPropertyDialog = ({ property }: EditPropertyDialogProps) => {
  const [open, setOpen] = useState(false);
  const { backgroundClass } = useColorPalette();
  const { editedProperty, setEditedProperty, handleSubmit, isLoading, handlePhotoUpload } = useEditProperty(property, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le bien</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre bien immobilier
          </DialogDescription>
        </DialogHeader>
        
        <PropertyForm 
          newProperty={editedProperty}
          onChange={setEditedProperty}
        />

        <div className="grid gap-2">
          <Label htmlFor="photo">Photo</Label>
          <div className="flex items-center gap-2">
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="flex-1"
            />
            {property.photo_url && (
              <img
                src={property.photo_url}
                alt="Aperçu"
                className="h-10 w-10 object-cover rounded"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button 
            className={`text-white ${backgroundClass}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Modification en cours..." : "Modifier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
