import { useState } from "react";
import {
  NavigationMenu as NavigationMenuPrimitive,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { usePathname } from 'react-router-dom';
import { cn } from "@/lib/utils"
import { Home, LayoutDashboard, Settings, Users, MessageSquare, Lightbulb, ListChecks } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";

const LIST_STYLES = "grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3";
const LINK_STYLES = "block font-medium text-sm";

const configurations = [
  {
    title: "Interface",
    href: "/docs/installation",
    description: "How to install dependencies and structure your app.",
  },
  {
    title: "Theme",
    href: "/docs/configuration",
    description: "Set up authentication with magic-link or OAuth providers.",
  },
  {
    title: "Authentication",
    href: "/docs/configuration",
    description: "Set up authentication with magic-link or OAuth providers.",
  },
]

export const NavigationMenu = ({ collapsed }: { collapsed: boolean }) => {
  const pathname = usePathname();
  const { isAdmin } = usePagePermissions();

  // Configuration des éléments de menu
  const menuItems = [
    {
      title: "Navigation",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
          permissions: ["basic", "pro"],
        },
        {
          name: "Accueil",
          path: "/",
          icon: Home,
          permissions: ["basic", "pro"],
        },
      ],
    },
    {
      title: "Fonctionnalités",
      items: [
        {
          name: "Dépenses",
          path: "/expenses",
          icon: ListChecks,
          permissions: ["basic", "pro"],
        },
        {
          name: "Epargne",
          path: "/savings",
          icon: Settings,
          permissions: ["basic", "pro"],
        },
      ],
    },
  ];

  // Configuration des éléments de menu pour les administrateurs
  const adminMenuItems = [
    {
      title: "Administration",
      items: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
          permissions: ["admin"],
        },
      ],
    },
    {
      title: "Gestion",
      items: [
        {
          name: "Feedbacks",
          path: "/admin/feedbacks",
          icon: MessageSquare,
          permissions: ["admin"],
        },
        {
          name: "Changelog",
          path: "/admin/changelog",
          icon: Settings,
          permissions: ["admin"],
        },
        {
          name: "Utilisateurs",
          path: "/admin/users",
          icon: Users,
          permissions: ["admin"],
        },
        {
          name: "Contributions",
          path: "/admin/contributions",
          icon: Lightbulb, // Utiliser Lightbulb de Lucide pour l'icône des contributions
          permissions: ["admin"],
        },
      ],
    },
  ];

  return (
    <NavigationMenuPrimitive className="relative">
      <NavigationMenuList className="max-md:grid max-md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:flex md:items-center md:gap-6">
        {(isAdmin ? adminMenuItems : menuItems).map((menuSection, index) => (
          <div key={index}>
            {menuSection.title && (
              <div className="hidden px-4 text-sm font-semibold opacity-70 md:block">
                {menuSection.title}
              </div>
            )}
            {menuSection.items.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "data-[active]:text-foreground data-[active]:shadow-sm",
                    pathname === item.path ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50",
                    "flex h-9 w-full items-center justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground md:w-auto md:px-3"
                  )}
                  href={item.path}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.name}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </div>
        ))}
      </NavigationMenuList>
    </NavigationMenuPrimitive>
  );
};
