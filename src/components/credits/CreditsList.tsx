
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Credit {
  id: string;
  nom_credit: string;
  nom_domaine: string;
  logo_url: string;
  montant_mensualite: number;
  date_derniere_mensualite: string;
  statut: 'actif' | 'remboursé';
  created_at: string;
}

export function CreditsList() {
  const { data: credits, isLoading } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }

      return data as Credit[];
    }
  });

  if (isLoading) return <div>Chargement...</div>;

  const activeCredits = credits?.filter(credit => credit.statut === 'actif') || [];
  const paidCredits = credits?.filter(credit => credit.statut === 'remboursé') || [];

  const CreditTable = ({ credits, title }: { credits: Credit[], title: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Table className="border-separate border-spacing-y-1">
        <TableHeader>
          <TableRow className="border-0">
            <TableHead className="text-card-foreground dark:text-card-foreground">Crédit</TableHead>
            <TableHead className="text-card-foreground dark:text-card-foreground text-center">Mensualité</TableHead>
            <TableHead className="text-card-foreground dark:text-card-foreground text-center">Dernière échéance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credits.map((credit) => (
            <TableRow
              key={credit.id}
              className="rounded-lg bg-card dark:bg-card hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors"
            >
              <TableCell className="border-t border-b border-l border-slate-300 rounded-l-lg py-2">
                <div className="flex items-center gap-3">
                  <img
                    src={credit.logo_url}
                    alt={credit.nom_credit}
                    className="w-8 h-8 rounded-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <span className="font-semibold">{credit.nom_credit}</span>
                </div>
              </TableCell>
              <TableCell className="border-t border-b border-slate-200 text-center py-2">
                {credit.montant_mensualite.toLocaleString('fr-FR')} €
              </TableCell>
              <TableCell className="border-t border-b border-r border-slate-200 rounded-r-lg text-center py-2">
                {new Date(credit.date_derniere_mensualite).toLocaleDateString('fr-FR')}
              </TableCell>
            </TableRow>
          ))}
          {credits.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Aucun crédit
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8">
      <CreditTable credits={activeCredits} title="Crédits actifs" />
      <CreditTable credits={paidCredits} title="Historique des crédits remboursés" />
    </div>
  );
}
