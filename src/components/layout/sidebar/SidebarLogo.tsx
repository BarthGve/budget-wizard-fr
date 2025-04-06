
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";

interface SidebarLogoProps {
  collapsed: boolean;
}

export const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  return (
    <Link 
      to="/dashboard" 
      className={cn(
        "flex items-center",
        collapsed ? "justify-center" : "justify-start" 
      )}
    >
      {/* Logo - affiché que le logo soit réduit ou non */}
      <img
        src="/lovable-uploads/icone_lovable.jpeg"
        alt="Logo"
        className="w-6 h-6 rounded-md"
      />
      
      {/* Texte - affiché uniquement quand la sidebar n'est pas réduite */}
      {!collapsed && (
        <span className="ml-2 font-semibold text-primary">{appConfig.name}</span>
      )}
    </Link>
  );
};
