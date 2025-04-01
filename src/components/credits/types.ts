
export interface Credit {
  id: string;
  nom_credit: string;
  nom_domaine: string;
  logo_url?: string;
  montant_mensualite: number;
  date_derniere_mensualite: string;
  date_premiere_mensualite: string;
  statut: "actif" | "remboursé" | "dépassé";
  created_at: string;
  vehicle_id?: string | null;
  vehicle_expense_type?: string | null;
  auto_generate_vehicle_expense?: boolean;
}

export const ALL_STATUS = "all_status";
export const statusLabels = {
  actif: "Actif",
  remboursé: "Remboursé",
  dépassé: "Dépassé"
};
