import { SavingsProjectList } from "./SavingsProjectList";
import { SavingsProject } from "@/types/savings-project";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectsSectionProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
  forceRefresh: number;
}

export const ProjectsSection = ({ 
  projects, 
  onProjectDeleted,
  forceRefresh 
}: ProjectsSectionProps) => {
  const [showProjects, setShowProjects] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Écouteur pour les modifications des projets d'épargne
    const channel = supabase
      .channel('savings-projects-changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'projets_epargne'
        },
        (payload) => {
          console.log('Modification des projets d\'épargne:', payload);
          queryClient.invalidateQueries({ queryKey: ['savings-projects'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const toggleProjectsVisibility = () => {
    setShowProjects(prev => !prev);
  };

  return (
    <div className="w-full px-2 md:px-0">
      <div className="flex items-center justify-between p-2 md:p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-quaternary-500 via-quaternary-500 to-teal-400 bg-clip-text text-transparent dark:from-quaternary-400 dark:via-quaternary-400 dark:to-teal-300 animate-fade-in text-xl md:text-2xl">Projets d'épargne</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleProjectsVisibility}
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            "text-gray-500 hover:text-quaternary-600",
            "dark:text-gray-400 dark:hover:text-quaternary-400"
          )}
        >
          {showProjects ? (
            <>
              Masquer
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Afficher ({projects?.length || 0})
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      <SavingsProjectList 
        projects={projects} 
        onProjectDeleted={onProjectDeleted} 
        showProjects={showProjects}
        forceRefresh={forceRefresh}
      />
    </div>
  );
};
