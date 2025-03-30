
import { FUEL_TYPES } from "@/types/vehicle";

// Fonction helper pour obtenir le label du type de carburant
export const getFuelTypeLabel = (value: string) => {
  const fuelType = FUEL_TYPES.find(type => type.value === value);
  return fuelType ? fuelType.label : value;
};

// Autres fonctions utilitaires liées aux véhicules peuvent être ajoutées ici
