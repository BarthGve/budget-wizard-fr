
export interface Credit {
  id: string;
  nom_credit: string;
  nom_domaine: string;
  logo_url?: string;
  montant_mensualite: number;
  date_derniere_mensualite: string;
  statut: "actif" | "remboursé";
  created_at: string;
}

export const ALL_STATUS = "all_status";
export const statusLabels = {
  actif: "Actif",
  remboursé: "Remboursé"
};
