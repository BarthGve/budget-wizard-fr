
export interface Credit {
  id: string;
  nom_credit: string;
  nom_domaine: string;
  montant_mensualite: number;
  date_premiere_mensualite: string;
  date_derniere_mensualite: string;
  statut: string;
  logo_url?: string;
  profile_id: string;
  created_at: string;
  updated_at?: string;
  vehicle_id?: string | null;
  vehicle_expense_type?: string | null;
  auto_generate_vehicle_expense?: boolean;
}
