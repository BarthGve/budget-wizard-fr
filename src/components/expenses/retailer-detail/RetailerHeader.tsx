import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Building2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RetailerHeaderProps {
  retailer: {
    id: string;
    name: string;
    logo_url?: string;
  };
  onAddExpense: () => void;
  colorScheme?: "blue" | "purple" | "green";
}

export function RetailerHeader({ 
  retailer, 
  onAddExpense, 
  colorScheme = "blue" 
}: RetailerHeaderProps) {
  // Configuration des couleurs selon le schéma choisi
  const colors = {
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      hoverFrom: "hover:from-blue-600",
      hoverTo: "hover:to-sky-500",
      backButton: "text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300",
      titleText: "text-blue-950 dark:text-blue-100",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      shadow: "shadow-blue-500/10",
      logoBorder: "border-blue-200 dark:border-blue-800"
    },
    purple: {
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-400",
      hoverFrom: "hover:from-purple-600",
      hoverTo: "hover:to-violet-500",
      backButton: "text-purple-700 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300",
      titleText: "text-purple-950 dark:text-purple-100",
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      shadow: "shadow-purple-500/10",
      logoBorder: "border-purple-200 dark:border-purple-800"
    },
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      hoverFrom: "hover:from-green-600",
      hoverTo: "hover:to-emerald-500",
      backButton: "text-green-700 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300",
      titleText: "text-green-950 dark:text-green-100",
      badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      shadow: "shadow-green-500/10",
      logoBorder: "border-green-200 dark:border-green-800"
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
        
        {/* Bouton d'ajout */}
        <Button 
          onClick={onAddExpense} 
          className={cn(
            "bg-gradient-to-r shadow-md transition-all",
            currentColors.gradientFrom,
            currentColors.gradientTo,
            currentColors.hoverFrom,
            currentColors.hoverTo,
            "text-white font-medium",
            "hover:shadow-lg",
            currentColors.shadow
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une dépense
        </Button>
      </div>
    </div>
  );
}
