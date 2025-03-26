
import { useState } from "react";
import { useHousing } from "@/hooks/useHousing";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { geocodeAddress } from "@/services/geocoding";
import { toast } from "sonner";

interface HousingFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name?: string;
    address?: string;
    area?: number;
    heating_type?: string;
  };
}

export const HousingForm = ({ onSuccess, initialData }: HousingFormProps) => {
  const { currentUser } = useCurrentUser();
  const { createOrUpdateProperty } = useHousing();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "Résidence principale",
    address: initialData?.address || "",
    area: initialData?.area?.toString() || "",
    heating_type: initialData?.heating_type || ""
  });

  const heatingTypes = [
    "Électrique", 
    "Gaz", 
    "Fioul", 
    "Pompe à chaleur", 
    "Bois/Pellets", 
    "Charbon", 
    "Solaire", 
    "Géothermie", 
    "Autre"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérification des champs obligatoires
      if (!formData.address.trim()) {
        toast.error("L'adresse est obligatoire");
        setIsLoading(false);
        return;
      }

      if (!formData.area || Number(formData.area) <= 0) {
        toast.error("La surface doit être supérieure à 0");
        setIsLoading(false);
        return;
      }

      if (!formData.heating_type) {
        toast.error("Le type de chauffage est obligatoire");
        setIsLoading(false);
        return;
      }

      // Géocodage de l'adresse
      let coordinates;
      try {
        coordinates = await geocodeAddress(formData.address);
      } catch (error) {
        toast.error("Impossible de géolocaliser cette adresse");
        setIsLoading(false);
        return;
      }

      // Préparation des données pour l'insertion
      const propertyData = {
        id: initialData?.id,
        name: formData.name.trim(),
        address: formData.address.trim(),
        area: Number(formData.area),
        heating_type: formData.heating_type,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        purchase_value: 0, // Valeur par défaut
        profile_id: currentUser?.id
      };

      // Création ou mise à jour du logement
      await createOrUpdateProperty.mutateAsync(propertyData as any);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du logement:", error);
      toast.error("Erreur lors de l'enregistrement du logement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 rue du Logement, 75000 Paris"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Superficie (m²) *</Label>
          <Input
            id="area"
            name="area"
            type="number"
            min="1"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="80"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heating_type">Type de chauffage *</Label>
          <Select
            value={formData.heating_type}
            onValueChange={(value) => handleSelectChange("heating_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type de chauffage" />
            </SelectTrigger>
            <SelectContent>
              {heatingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Enregistrement..." : "Enregistrer mon logement"}
      </Button>
    </form>
  );
};
