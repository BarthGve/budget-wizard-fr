
export interface Credit {
  id: string;
  nom_credit: string;
  nom_domaine: string;
  montant_mensualite: number;
  date_premiere_mensualite: string; // Format ISO 'YYYY-MM-DD'
  date_derniere_mensualite: string; // Format ISO 'YYYY-MM-DD'
  statut: 'actif' | 'remboursé';
  logo_url?: string;
  profile_id: string;
  vehicle_id?: string | null;
  vehicle_expense_type?: string | null;
  auto_generate_vehicle_expense?: boolean;
}
