
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Edit, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangelogEntry } from "../types";
import { toggleChangelogVisibility } from "@/services/changelog";
import { toast } from "@/hooks/useToastWrapper";
import { supabase } from "@/integrations/supabase/client";

interface ChangelogEntryActionsProps {
  entry: ChangelogEntry;
  onEdit: (entry: ChangelogEntry) => void;
  onDelete: (entryId: string) => void;
}

export const ChangelogEntryActions = ({ 
  entry, 
  onEdit, 
  onDelete 
}: ChangelogEntryActionsProps) => {
  const [updatingVisibility, setUpdatingVisibility] = useState<boolean>(false);
  const [isNotifying, setIsNotifying] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleToggleVisibility = async () => {
    try {
      setUpdatingVisibility(true);
      await toggleChangelogVisibility(entry.id, !entry.is_visible);
      
      await queryClient.invalidateQueries({ queryKey: ["changelog"] });
      
      toast(!entry.is_visible 
        ? "Entrée rendue visible" 
        : "Entrée masquée"
      );
    } catch (error) {
      console.error("Erreur lors du changement de visibilité:", error);
      toast.error("Impossible de changer la visibilité de l'entrée");
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handleNotifyUsers = async () => {
    if (isNotifying) return;
    
    try {
      setIsNotifying(true);
      console.log(`Envoi d'une notification manuelle pour l'entrée ${entry.id}`);
      
      // Appel à la fonction Edge pour notifier les utilisateurs
      const { data, error } = await supabase.functions.invoke("notify-changelog", {
        body: { id: entry.id, manual: true }
      });
      
      if (error) {
        console.error("Erreur lors de la notification:", error);
        throw new Error(`Échec de la notification: ${error.message || "Erreur inconnue"}`);
      }
      
      toast("Notification envoyée aux utilisateurs");
      console.log("Réponse de notification:", data);
    } catch (error) {
      console.error("Erreur lors de l'envoi de notification:", error);
      toast.error("Impossible d'envoyer la notification");
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(entry)}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleToggleVisibility}
          disabled={updatingVisibility}
        >
          {entry.is_visible ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Masquer
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Rendre visible
            </>
          )}
        </DropdownMenuItem>
        
        {/* Nouvel élément de menu pour notifier les utilisateurs */}
        <DropdownMenuItem
          onClick={handleNotifyUsers}
          disabled={isNotifying}
        >
          <Bell className="h-4 w-4 mr-2" />
          {isNotifying ? "Notification en cours..." : "Notifier les utilisateurs"}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(entry.id)}
          className="text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
