import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsProjectList } from "@/components/savings/SavingsProjectList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SavingsProject } from "@/types/savings-project";
import { useTheme } from "next-themes";

interface ProjectsSectionProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
  showInitial?: boolean;
  forceRefresh: number;
}

export const ProjectsSection = ({ 
  projects, 
  onProjectDeleted,
  showInitial = true,
  forceRefresh
}: ProjectsSectionProps) => {
  const [showProjects, setShowProjects] = useState(showInitial);
  const { theme } = useTheme();

  const toggleProjectsVisibility = () => {
    setShowProjects(prev => !prev);
  };

  return (
    <motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-quaternary-500 via-quaternary-500 to-quaternary-400 bg-clip-text text-transparent dark:from-quaternary-400 dark:via-quaternary-400 dark:to-teal-300 animate-fade-in text-2xl">Projets</h2>
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
              Afficher ({projects.length})
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <SavingsProjectList 
          projects={projects} 
          onProjectDeleted={onProjectDeleted} 
          showProjects={showProjects}
          forceRefresh={forceRefresh} 
        />
      </div>
    </motion.div>
  );
};
