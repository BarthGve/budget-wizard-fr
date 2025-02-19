
export interface Retailer {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RetailerFormData {
  name: string;
  domain: string;
}
