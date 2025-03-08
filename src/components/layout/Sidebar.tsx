
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { MessageSquareText, ArrowLeftFromLine, ArrowRightFromLine, Settings, Save, CreditCard, PieChart, BadgeDollarSign, Home, Building, Wrench, Heart, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { ContributionDialog } from "@/components/contributions/ContributionDialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { currentUser, isAdmin } = useCurrentUser();
  
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={cn(
      "h-screen sticky top-0 border-r transition-all duration-300 ease-in-out",
      collapsed ? "w-[80px]" : "w-[250px]"
    )}>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header et logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight"
            >
              Financy
            </motion.div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn(
              "h-8 w-8 rounded-full",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? <ArrowRightFromLine className="h-4 w-4" /> : <ArrowLeftFromLine className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link to="/dashboard">
            <Button 
              variant={isActive("/dashboard") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <Home className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Tableau de bord</span>}
            </Button>
          </Link>
          
          <Link to="/expenses">
            <Button 
              variant={isActive("/expenses") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <BadgeDollarSign className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Dépenses</span>}
            </Button>
          </Link>
          
          <Link to="/recurring-expenses">
            <Button 
              variant={isActive("/recurring-expenses") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <PieChart className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Charges fixes</span>}
            </Button>
          </Link>
          
          <Link to="/credits">
            <Button 
              variant={isActive("/credits") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <CreditCard className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Crédits</span>}
            </Button>
          </Link>
          
          <Link to="/savings">
            <Button 
              variant={isActive("/savings") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <Save className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Épargnes</span>}
            </Button>
          </Link>
          
          <Link to="/properties">
            <Button 
              variant={isActive("/properties") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <Building className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Patrimoine</span>}
            </Button>
          </Link>
          
          {isAdmin && (
            <Link to="/admin">
              <Button 
                variant={location.pathname.startsWith("/admin") ? "secondary" : "ghost"} 
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center"
                )}
              >
                <Wrench className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && <span>Administration</span>}
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Footer avec feedback et paramètres */}
        <div className="p-3 border-t space-y-1">
          {!isAdmin && (
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
              onClick={() => setContributionDialogOpen(true)}
            >
              <HeartHandshake className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Contribuer</span>}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center"
            )}
            onClick={() => setFeedbackDialogOpen(true)}
          >
            <Heart className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>Feedback</span>}
          </Button>
          
          <Link to="/settings">
            <Button 
              variant={isActive("/settings") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
            >
              <Settings className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Paramètres</span>}
            </Button>
          </Link>
        </div>
      </div>
      
      <FeedbackDialog 
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
      />
      
      <ContributionDialog 
        open={contributionDialogOpen}
        onOpenChange={setContributionDialogOpen}
      />
    </div>
  );
};
