
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Banknote,
  PiggyBank,
  ClipboardList,
  Home,
  TrendingUp,
  Mailbox,
  CreditCard,
  ShoppingBasket,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { LucideIcon } from "lucide-react";
import { usePendingFeedbacks } from "@/hooks/usePendingFeedbacks";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
  matchPath?: string;
}

interface NavigationMenuProps {
  collapsed: boolean;
  isAdmin: boolean;
}

// Définir les menus en dehors du composant
const adminMenu: MenuItem[] = [
  { title: "Gestion utilisateurs", icon: Users, path: "/admin", matchPath: "^/admin$" },
  { title: "Boite des feedbacks", icon: Mailbox, path: "/admin/feedbacks", matchPath: "^/admin/feedbacks$" },
  { title: "Changelog", icon: List, path: "/admin/changelog", matchPath: "^/admin/changelog$" }
];

const userMenu: MenuItem[] = [
  { title: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Revenus", icon: Banknote, path: "/contributors" },
  { title: "Dépenses", icon: ShoppingBasket, path: "/expenses" },
  { title: "Charges Récurrentes", icon: ClipboardList, path: "/recurring-expenses" },
  { title: "Crédits", icon: CreditCard, path: "/credits" },
  { title: "Épargne", icon: PiggyBank, path: "/savings" },
  { title: "Bourse", icon: TrendingUp, path: "/stocks" },
  { title: "Immobilier", icon: Home, path: "/properties" },
];

export const NavigationMenu = ({ collapsed, isAdmin }: NavigationMenuProps) => {
  const location = useLocation();
  const { canAccessPage } = usePagePermissions();
  // Nous passons maintenant isAdmin directement au hook
  const { pendingCount } = usePendingFeedbacks(isAdmin);

  const menuItems = isAdmin ? adminMenu : userMenu.filter(item => canAccessPage(item.path));

  return (
    <nav className="flex flex-col h-full justify-between p-4">
      <ul >
        {menuItems.map((item) => {
          // Use a proper matching logic for active state
          const isActive = item.matchPath
            ? new RegExp(item.matchPath).test(location.pathname)
            : location.pathname === item.path;
            
          // Vérifier si c'est le lien vers les feedbacks et s'il y a des feedbacks en attente
          const showBadge = isAdmin && item.path === "/admin/feedbacks" && pendingCount > 0;

          return (
           <li key={item.path}>
  <NavLink
    to={item.path}
    className={({ isActive }) => cn(
      "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
      // Hover avec un gris très léger
      "hover:bg-gray-100 dark:hover:bg-gray-800/60",
      collapsed && "justify-center",
      // État actif avec un gris plus prononcé et élégant
      isActive && "bg-gray-200 text-gray-900 hover:bg-gray-200/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-800/90"
    )}
    end
  >
    <div className="relative">
      <item.icon className={cn(
        "h-5 w-5 flex-shrink-0",
        // Ajout d'une couleur légèrement plus foncée pour l'icône active
        isActive ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
      )} />
      {showBadge && (
        <Badge 
          variant="destructive" 
          className={cn(
            "absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center rounded-full",
            collapsed ? "-right-1" : "-right-1.5"
          )}
        >
          {pendingCount > 9 ? '9+' : pendingCount}
        </Badge>
      )}
    </div>
    {!collapsed && (
      <span className={cn(
        "truncate",
        // Nuances de texte selon l'état actif
        isActive ? "font-medium" : "text-gray-600 dark:text-gray-300"
      )}>
        {item.title}
      </span>
    )}
  </NavLink>
</li>

          );
        })}
      </ul>
    </nav>
  );
};
