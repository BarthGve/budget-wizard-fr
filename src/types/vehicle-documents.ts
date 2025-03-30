
export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  category_id: string;
  name: string;
  description?: string | null;
  file_path: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleDocumentCategory {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  created_at: string;
}

export interface DocumentFormValues {
  name: string;
  description?: string;
  category_id: string;
  file: File;
}
