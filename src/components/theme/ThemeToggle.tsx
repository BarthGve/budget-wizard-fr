
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  // Assure que le composant est monté côté client pour éviter les incohérences SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour appliquer le thème avec une animation de transition
  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    
    // Ajouter une classe pour forcer le rafraîchissement du rendu
    document.documentElement.classList.add('theme-updated');
    
    // Supprimer la classe après l'animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-updated');
    }, 100);
  };

  // Ne rend rien jusqu'à ce que le composant soit monté pour éviter les incohérences d'affichage
  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "w-9 px-0",
            isMobile && collapsed && "mx-auto",
            isMobile && !collapsed && "w-full flex items-center justify-start gap-2 px-2"
          )}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {isMobile && !collapsed && <span className="ml-6">Thème</span>}
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "end" : "end"}>
        <DropdownMenuItem onClick={() => applyTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
