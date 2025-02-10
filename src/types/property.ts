
export interface Property {
  id: string;
  name: string;
  address: string;
  area: number;
  latitude: number;
  longitude: number;
  purchase_value: number;
  monthly_rent?: number | null;
  loan_payment?: number | null;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
  profile_id: string;
}
