
export interface SavingsProject {
  id: string;
  profile_id: string;
  name: string;
  description: string;
  image_url: string;
  target_amount: number;
  target_date?: string;
  monthly_amount?: number;
  created_at: string;
  updated_at: string;
  convert_to_monthly: boolean;
  mode_planification: "par_date" | "par_mensualite";
  montant_total: number;
  nom_projet: string;
  nombre_mois?: number;
  date_estimee?: string;
  montant_mensuel?: number;
  added_to_recurring?: boolean;
}

export type SavingsMode = 'target_date' | 'monthly_amount';

