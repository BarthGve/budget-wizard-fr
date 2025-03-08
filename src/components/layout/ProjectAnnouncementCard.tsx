
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ContributionDialog } from "@/components/contribution/ContributionDialog";
import { ContributionTrigger } from "@/components/contribution/ContributionTrigger";
import { supabase } from "@/integrations/supabase/client";

interface ProjectAnnouncementCardProps {
  collapsed: boolean;
  userId?: string;
}

export const ProjectAnnouncementCard = ({ collapsed, userId }: ProjectAnnouncementCardProps) => {
  const [hasContributed, setHasContributed] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Vérifier si l'utilisateur a déjà contribué
  useEffect(() => {
    if (!userId) return;

    const checkContributions = async () => {
      const { data, error } = await supabase
        .from('contributions')
        .select('id')
        .eq('profile_id', userId)
        .limit(1);
      
      if (!error && data) {
        setHasContributed(data.length > 0);
      }
    };

    checkContributions();
  }, [userId]);

  const handleDismiss = () => {
    setShowCard(false);
    localStorage.setItem('project_announcement_dismissed', 'true');
  };

  // Vérifier si la carte a été précédemment masquée
  useEffect(() => {
    const dismissed = localStorage.getItem('project_announcement_dismissed');
    if (dismissed === 'true') {
      setShowCard(false);
    }
  }, []);

  if (!showCard) return null;

  return (
    <Card 
      className={cn(
        "mb-4 mx-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-900 border-violet-200 dark:border-violet-800 overflow-hidden",
        collapsed && "mx-1"
      )}
    >
      <CardContent className={cn(
        "p-3 flex flex-col space-y-2",
        collapsed && "p-2"
      )}>
        {!collapsed ? (
          <>
            <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
              Vous aimez l'application?
            </p>
            <p className="text-xs text-violet-700 dark:text-violet-400">
              Contribuez au projet et aidez-nous à l'améliorer!
            </p>
            <div className="flex justify-between items-center pt-1">
              <button 
                onClick={handleDismiss}
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300"
              >
                Masquer
              </button>
              <div onClick={() => setIsOpen(true)}>
                <ContributionTrigger 
                  hasContributed={hasContributed} 
                  onClick={() => setIsOpen(true)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div onClick={() => setIsOpen(true)}>
              <ContributionTrigger 
                hasContributed={hasContributed} 
                isCollapsed={true}
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        )}
      </CardContent>
      <ContributionDialog open={isOpen} onOpenChange={setIsOpen} />
    </Card>
  );
};
