
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useUserData } from "./useUserData";

interface SidebarContentProps {
  collapsed: boolean;
  isAdmin: boolean;
  userId?: string;
  onItemClick?: () => void;
}

export const SidebarContent = ({ collapsed, isAdmin, userId, onItemClick }: SidebarContentProps) => {
  // Utilisation du hook useUserData pour vérifier l'état du chargement des données
  const { isLoading, currentUser, refreshUserData } = useUserData();
  
  // Affichage d'un état de chargement
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 space-y-4 opacity-70">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }
  
  // Affichage d'un message d'erreur et d'un bouton pour réessayer
  if (!currentUser) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
        <p className="text-sm text-muted-foreground mb-3">Impossible de charger le menu</p>
        <button 
          onClick={() => refreshUserData()}
          className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Menu de navigation */}
      <NavigationMenu 
        collapsed={collapsed} 
        isAdmin={isAdmin}
        userId={userId || currentUser.id}
        onItemClick={onItemClick}
      />
    </div>
  );
};
