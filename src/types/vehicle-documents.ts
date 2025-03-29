
// Types pour les documents de véhicules
export type VehicleDocumentCategory = {
  id: string;
  name: string;
  description?: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
};

export type VehicleDocument = {
  id: string;
  vehicle_id: string;
  category_id: string;
  name: string;
  description?: string;
  file_path: string;
  file_size?: number;
  content_type?: string;
  created_at?: string;
  updated_at?: string;
};
