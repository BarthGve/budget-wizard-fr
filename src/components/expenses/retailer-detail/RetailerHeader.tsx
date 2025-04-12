
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Building2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface RetailerHeaderProps {
  retailer: {
    id: string;
    name: string;
    logo_url?: string;
  };
  onAddExpense: () => void;
  colorScheme?: "tertiary" | "primary" | "quaternary";
}

export function RetailerHeader({ 
  retailer, 
  onAddExpense, 
  colorScheme = "tertiary" 
}: RetailerHeaderProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Configuration des couleurs selon le schéma choisi
  const colors = {
    tertiary: {
      gradientFrom: "from-tertiary-500",
      gradientTo: "to-sky-400",
      hoverFrom: "hover:from-tertiary-600",
      hoverTo: "hover:to-sky-500",
      backButton: "text-tertiary-700 hover:text-tertiary-500 dark:text-tertiary-400 dark:hover:text-tertiary-300",
      titleText: "text-tertiary-950 dark:text-tertiary-100",
      badge: "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-900/30 dark:text-tertiary-300",
      shadow: "shadow-tertiary-500/10",
      logoBorder: "border-tertiary-200 dark:border-tertiary-800"
    },
    primary: {
      gradientFrom: "from-primary-500",
      gradientTo: "to-violet-400",
      hoverFrom: "hover:from-primary-600",
      hoverTo: "hover:to-violet-500",
      backButton: "text-primary-700 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300",
      titleText: "text-primary-950 dark:text-primary-100",
      badge: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
      shadow: "shadow-primary-500/10",
      logoBorder: "border-primary-200 dark:border-primary-800"
    },
    quaternary: {
      gradientFrom: "from-quaternary-500",
      gradientTo: "to-emerald-400",
      hoverFrom: "hover:from-quaternary-600",
      hoverTo: "hover:to-emerald-500",
      backButton: "text-quaternary-700 hover:text-quaternary-500 dark:text-quaternary-400 dark:hover:text-quaternary-300",
      titleText: "text-quaternary-950 dark:text-quaternary-100",
      badge: "bg-quaternary-100 text-quaternary-700 dark:bg-quaternary-900/30 dark:text-quaternary-300",
      shadow: "shadow-quaternary-500/10",
      logoBorder: "border-quaternary-200 dark:border-quaternary-800"
    }
  };

  const currentColors = colors[colorScheme];

  return (
    <div className="flex flex-col space-y-6 pb-4 border-b dark:border-gray-800">
      {/* Bouton retour */}
      <Link 
        to="/expenses" 
        className={cn(
          "flex items-center w-fit text-sm transition-colors",
          currentColors.backButton
        )}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Retour aux dépenses</span>
      </Link>
      
      <div className="flex items-center justify-between">
        {/* Partie gauche avec logo et nom */}
        <div className="flex items-center gap-4">
          {retailer.logo_url ? (
            <div className={cn(
              "h-14 w-14 rounded-xl overflow-hidden border bg-white dark:bg-gray-800",
              currentColors.logoBorder,
              "flex items-center justify-center",
              currentColors.shadow,
              "shadow-lg"
            )}>
              <img 
                src={retailer.logo_url} 
                alt={`Logo ${retailer.name}`} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallbackIcon = document.createElement("div");
                    fallbackIcon.className = cn("flex items-center justify-center h-full w-full", currentColors.badge);
                    
                    const icon = document.createElement("div");
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V2a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v20"/><path d="M12 13V7"/><path d="M10 7h4"/><path d="M10 13h4"/><path d="M6 22h12a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H6"/></svg>';
                    
                    fallbackIcon.appendChild(icon);
                    parent.appendChild(fallbackIcon);
                  }
                }}
              />
            </div>
          ) : (
            <div className={cn(
              "h-14 w-14 rounded-xl flex items-center justify-center",
              currentColors.badge
            )}>
              <Building2 className="h-7 w-7" />
            </div>
          )}
          
          <div>
            <h1 className={cn(
              "text-3xl font-bold",
              currentColors.titleText
            )}>
              {retailer.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn(
                "px-3 py-0.5 rounded-full text-xs font-medium",
                currentColors.badge
              )}>
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  <span>Commerçant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bouton d'ajout - modifié pour correspondre au bouton de la page dépenses */}
        <Button 
          onClick={onAddExpense} 
          variant="outline"
          className={cn(
            "h-10 px-4 border transition-all duration-200 rounded-md",
            "hover:scale-[1.02] active:scale-[0.98]",
            // Light mode
            "bg-white border-tertiary-200 text-tertiary-600",
            "hover:border-tertiary-300 hover:bg-tertiary-50/50 hover:text-tertiary-700",
            // Dark mode
            "dark:bg-gray-800 dark:border-tertiary-800/60 dark:text-tertiary-400",
            "dark:hover:bg-tertiary-900/20 dark:hover:border-tertiary-700 dark:hover:text-tertiary-300"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 2px 10px -2px rgba(37, 99, 235, 0.15)"
              : "0 2px 10px -2px rgba(37, 99, 235, 0.1)"
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
              // Light mode
              "bg-tertiary-100/80 text-tertiary-600",
              // Dark mode
              "dark:bg-tertiary-800/50 dark:text-tertiary-300"
            )}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-medium text-sm">Ajouter</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
