
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/types/profile";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data as Profile;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      if (error) throw error;
      return data;
    }
  });

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Contributeurs", icon: Users, path: "/contributors" },
    { title: "Épargne", icon: PiggyBank, path: "/savings" },
    { title: "Patrimoine", icon: Home, path: "/properties" },
    { title: "Charges Récurrentes", icon: ClipboardList, path: "/recurring-expenses" },
    ...(isAdmin ? [{ title: "Administration", icon: Shield, path: "/admin" }] : []),
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="flex flex-col flex-1">
        {/* App Name and Collapse Button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className={cn(
            "font-bold text-primary transition-all duration-300",
            collapsed ? "text-sm" : "text-xl"
          )}>
            {collapsed ? "SBW" : "Shared Budget Wizard"}
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
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
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover"
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

        {/* Profile and Logout Section */}
        <div className="mt-auto border-t border-gray-200">
          <div className="p-4">
            <div className={cn(
              "flex items-center mb-4",
              collapsed ? "justify-center" : "space-x-3"
            )}>
              <Avatar>
                <AvatarImage
                  src={profile?.avatar_url || undefined}
                  alt={profile?.full_name || "Avatar"}
                />
                <AvatarFallback>
                  {(profile?.full_name || "?")[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.full_name || "Utilisateur"}</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-primary hover:text-primary-hover"
                    onClick={() => navigate("/settings")}
                  >
                    Gérer le profil
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-primary/10 hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {!collapsed && <span>Déconnexion</span>}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
