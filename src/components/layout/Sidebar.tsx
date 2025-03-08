
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  PiggyBank, 
  Home,
  Menu,
  User,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { FeedbackDialog } from "../feedback/FeedbackDialog";
import { ContributionDialog } from "../contributions/ContributionDialog";
import { FeedbackTrigger } from "../feedback/FeedbackTrigger";
import { ContributionTrigger } from "../feedback/ContributionTrigger";

export function Sidebar({ collapsed = false, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useCurrentUser();
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const links = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: isActive("/dashboard"),
    },
    {
      title: "Dépenses",
      href: "/expenses",
      icon: CreditCard,
      active: isActive("/expenses"),
    },
    {
      title: "Épargne",
      href: "/savings",
      icon: PiggyBank,
      active: isActive("/savings"),
    },
    {
      title: "Immobilier",
      href: "/properties",
      icon: Home,
      active: isActive("/properties"),
    },
  ];

  const accountLinks = [
    {
      title: "Mon compte",
      href: "/user-settings",
      icon: User,
      active: isActive("/user-settings"),
    },
    {
      title: "Paramètres",
      href: "/settings",
      icon: Settings,
      active: isActive("/settings"),
    },
  ];

  const adminLinks = isAdmin ? [
    {
      title: "Administration",
      href: "/admin",
      icon: ShieldCheck,
      active: isActive("/admin"),
    },
  ] : [];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">FinGenius</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(collapsed && "mx-auto")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                link.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <link.icon className={cn("h-5 w-5 flex-none")} />
              {!collapsed && <span>{link.title}</span>}
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Section compte utilisateur */}
        <nav className="grid gap-1 px-2">
          {accountLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                link.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <link.icon className={cn("h-5 w-5 flex-none")} />
              {!collapsed && <span>{link.title}</span>}
            </Link>
          ))}
        </nav>

        {isAdmin && (
          <>
            <Separator className="my-4" />
            <nav className="grid gap-1 px-2">
              {adminLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    link.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <link.icon className={cn("h-5 w-5 flex-none")} />
                  {!collapsed && <span>{link.title}</span>}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Section feedback et contribution */}
      {!isAdmin && (
        <div className="mt-auto p-2">
          <FeedbackTrigger 
            collapsed={collapsed} 
            onClick={() => setFeedbackDialogOpen(true)} 
          />
          
          <ContributionTrigger 
            collapsed={collapsed} 
            onClick={() => setContributionDialogOpen(true)} 
          />
        </div>
      )}

      {/* Dialogs */}
      <FeedbackDialog 
        isOpen={feedbackDialogOpen} 
        onOpenChange={setFeedbackDialogOpen} 
      />
      
      <ContributionDialog
        isOpen={contributionDialogOpen}
        onOpenChange={setContributionDialogOpen}
      />
    </div>
  );
}
