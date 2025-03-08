
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Fonction pour vérifier si un lien est actif
const isActive = (currentPath: string, linkPath: string) => {
  return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
};

export const MainNavigationMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Finances</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/expenses"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      isActive(currentPath, "/expenses") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Dépenses</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gérez vos dépenses et visualisez vos statistiques
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/savings"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      isActive(currentPath, "/savings") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Épargne</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Suivez vos économies et définissez des objectifs d'épargne
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Immobilier</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/properties"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      isActive(currentPath, "/properties") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Mes biens</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gérez vos biens immobiliers et leurs dépenses
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/dashboard">
            <Button
              variant={isActive(currentPath, "/dashboard") ? "default" : "ghost"}
              className="px-4 py-2"
            >
              Tableau de bord
            </Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
