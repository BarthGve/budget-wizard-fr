
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  ClipboardList,
  Home,
  
  TrendingUp,
  Mailbox,

} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackDialog } from "../feedback/FeedbackDialog";

interface NavigationMenuProps {
  collapsed: boolean;
  isAdmin: boolean;
}

export const NavigationMenu = ({ collapsed, isAdmin }: NavigationMenuProps) => {
  const location = useLocation();

  const adminMenu = [
    { title: "Gestion utilisateurs", icon: Users, path: "/admin" },
    { title: "Boite des feedbacks", icon: Mailbox, path: "/admin/feedbacks" }
  ];
  
  const userMenu = [
    { title: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Contributeurs", icon: Users, path: "/contributors" },
    { title: "Épargne", icon: PiggyBank, path: "/savings" },
    { title: "Bourse", icon: TrendingUp, path: "/stocks" },
    { title: "Immobilier", icon: Home, path: "/properties" },
    { title: "Charges Récurrentes", icon: ClipboardList, path: "/recurring-expenses" }
  ];
  
  const menuItems = isAdmin ? [...adminMenu] : [...userMenu];

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isExactMatch = location.pathname === item.path;
          const isActive = item.path === "/admin" ? isExactMatch : location.pathname.startsWith(item.path);
          
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                  "hover:bg-primary/10",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary-hover"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
      
      {!isAdmin && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <FeedbackDialog />
        </div>
      )}
    </nav>
  );
};
