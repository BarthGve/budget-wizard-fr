
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  CreditCard, 
  Receipt, 
  PiggyBank, 
  TrendingUp, 
  Building2, 
  Car
} from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { Profile } from "@/types/profile";

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick?: () => void;
}

// Configuration des liens de navigation
const getNavItems = (isAdmin: boolean) => [
  { 
    name: "Tableau de bord", 
    path: "/dashboard", 
    icon: Home 
  },
  { 
    name: "Contributeurs", 
    path: "/contributors", 
    icon: Users 
  },
  { 
    name: "Dépenses", 
    path: "/expenses", 
    icon: Receipt 
  },
  { 
    name: "Dépenses mensuelles", 
    path: "/recurring-expenses", 
    icon: Receipt 
  },
  { 
    name: "Crédits", 
    path: "/credits", 
    icon: CreditCard 
  },
  { 
    name: "Épargne", 
    path: "/savings", 
    icon: PiggyBank 
  },
  { 
    name: "Investissements", 
    path: "/stocks", 
    icon: TrendingUp,
    requiresPro: true 
  },
  { 
    name: "Immobilier", 
    path: "/properties", 
    icon: Building2,
    requiresPro: true
  },
  { 
    name: "Véhicules", 
    path: "/vehicles", 
    icon: Car 
  }
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  collapsed,
  onItemClick
}) => {
  const { canAccessPage } = usePagePermissions();
  
  // Récupérer les éléments de navigation filtrés selon les permissions
  const navItems = getNavItems(false).filter(item => {
    // Vérifier l'accès à la page
    return canAccessPage(item.path);
  });

  return (
    <nav className="space-y-1 px-2 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
              collapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <item.icon className={cn("h-5 w-5", collapsed ? "mx-0" : "mr-2")} />
          {!collapsed && <span>{item.name}</span>}
        </NavLink>
      ))}
    </nav>
  );
};
