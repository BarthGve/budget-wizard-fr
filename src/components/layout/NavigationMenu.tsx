
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  ClipboardList,
  Home,
  Shield,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackDialog } from "../feedback/FeedbackDialog";

interface NavigationMenuProps {
  collapsed: boolean;
  isAdmin: boolean;
}

export const NavigationMenu = ({ collapsed, isAdmin }: NavigationMenuProps) => {
  const menuItems = [
    { title: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Contributeurs", icon: Users, path: "/contributors" },
    { title: "Épargne", icon: PiggyBank, path: "/savings" },
    { title: "Bourse", icon: TrendingUp, path: "/stocks" },
    { title: "Immobilier", icon: Home, path: "/properties" },
    { title: "Charges Récurrentes", icon: ClipboardList, path: "/recurring-expenses" },
    ...(isAdmin ? [
      { title: "Administration", icon: Shield, path: "/admin" },
      { title: "Feedbacks", icon: MessageSquare, path: "/admin/feedbacks" }
    ] : []),
  ];

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                  "hover:bg-[#9b87f5]/10",
                  isActive 
                    ? "bg-[#9b87f5] text-white hover:bg-[#8B5CF6]"
                    : "hover:text-[#9b87f5]"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      
      {!isAdmin && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <FeedbackDialog />
        </div>
      )}
    </nav>
  );
};
