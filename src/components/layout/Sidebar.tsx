
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Contributeurs", icon: Users, path: "/contributors" },
    { title: "Épargne", icon: PiggyBank, path: "/savings" },
    { title: "Notifications", icon: Bell, path: "/notifications" },
    { title: "Paramètres", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && <h1 className="text-xl font-semibold">Budget Wizard</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                      "hover:bg-gray-100",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-gray-700"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
