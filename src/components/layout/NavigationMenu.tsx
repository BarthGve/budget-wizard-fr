
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
      <ul className="space-y-2">
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
                  "hover:bg-primary/10",
                  collapsed && "justify-center",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary-hover"
                )}
                end
              >
                <div className="relative">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
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
                {!collapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
