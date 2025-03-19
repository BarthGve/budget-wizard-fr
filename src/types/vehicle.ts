
// Types pour les véhicules et dépenses associées
export type Vehicle = {
  id: string;
  registration_number: string;
  brand: string;
  model?: string;
  acquisition_date: string;
  photo_url?: string;
  fuel_type: string;
  status: "actif" | "inactif" | "vendu";
  created_at?: string;
  updated_at?: string;
};

export type VehicleExpenseType = {
  id: string;
  name: string;
  category: string;
};

export type FuelCompany = {
  id: string;
  name: string;
  logo_url?: string;
};

export type VehicleExpense = {
  id: string;
  vehicle_id: string;
  expense_type: string;
  date: string;
  amount: number;
  fuel_company_id?: string;
  fuel_volume?: number;
  mileage?: number;
  maintenance_type?: string;
  repair_type?: string;
  comment?: string;
};

export const FUEL_TYPES = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybride", label: "Hybride" },
  { value: "electrique", label: "Électrique" },
  { value: "gpl", label: "GPL" },
  { value: "ethanol", label: "Éthanol" }
];
