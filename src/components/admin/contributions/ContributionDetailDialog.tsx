
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contribution, ContributionStatus } from "./types";

interface ContributionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: Contribution;
  onStatusChange: (id: string, status: ContributionStatus) => void;
}

// Objet pour mapper les status aux badges
const statusBadges = {
  pending: { label: "À traiter", variant: "outline" as const },
  in_progress: { label: "En cours", variant: "secondary" as const },
  completed: { label: "Traité", variant: "default" as const }
};

// Objet pour mapper les types aux libellés
const typeLabels: Record<string, string> = {
  feature: "Nouvelle fonctionnalité",
  improvement: "Amélioration",
  bug: "Correction de bug",
  idea: "Idée",
  other: "Autre"
};

export const ContributionDetailDialog = ({ 
  open, 
  onOpenChange, 
  contribution, 
  onStatusChange 
}: ContributionDetailDialogProps) => {
  if (!contribution) return null;

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Détails de la contribution</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={contribution.profiles?.avatar_url} alt={contribution.profiles?.full_name || 'Utilisateur'} />
                <AvatarFallback>{getInitials(contribution.profiles?.full_name || 'Utilisateur')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{contribution.profiles?.full_name || 'Utilisateur'}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(contribution.created_at), 'dd/MM/yyyy à HH:mm')}
                </p>
              </div>
            </div>
            <Badge variant={statusBadges[contribution.status].variant}>
              {statusBadges[contribution.status].label}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
            <p>{typeLabels[contribution.type] || contribution.type}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Titre</p>
            <p className="font-medium">{contribution.title}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Détails</p>
            <div className="mt-1 whitespace-pre-wrap rounded-md border p-4 text-sm">
              {contribution.content}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <div className="flex flex-1 justify-start">
            <Button
              variant={contribution.status === "pending" ? "default" : "outline"}
              onClick={() => onStatusChange(contribution.id, "pending")}
              disabled={contribution.status === "pending"}
              className="mr-2"
            >
              À traiter
            </Button>
            <Button
              variant={contribution.status === "in_progress" ? "default" : "outline"}
              onClick={() => onStatusChange(contribution.id, "in_progress")}
              disabled={contribution.status === "in_progress"}
              className="mr-2"
            >
              En cours
            </Button>
            <Button
              variant={contribution.status === "completed" ? "default" : "outline"}
              onClick={() => onStatusChange(contribution.id, "completed")}
              disabled={contribution.status === "completed"}
            >
              Traité
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
