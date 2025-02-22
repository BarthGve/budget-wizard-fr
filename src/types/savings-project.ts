
export interface SavingsProject {
  id: string;
  profile_id: string;
  nom_projet: string;
  description: string;
  image_url: string;
  montant_total: number;
  target_date?: string;
  montant_mensuel?: number;
  created_at: string;
  updated_at: string;
  mode_planification: "par_date" | "par_mensualite";
  nombre_mois?: number;
  date_estimee?: string;
  added_to_recurring?: boolean;
  statut?: "actif" | "dépassé";
}

export type SavingsMode = "par_date" | "par_mensualite";

