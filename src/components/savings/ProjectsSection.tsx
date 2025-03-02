
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsProjectList } from "@/components/savings/SavingsProjectList";
import { ChevronDown, ChevronUp, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SavingsProject } from "@/types/savings-project";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ProjectsSectionProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
  onNewProjectClick: () => void;
  showInitial?: boolean;
}

export const ProjectsSection = ({ 
  projects, 
  onProjectDeleted,
  onNewProjectClick,
  showInitial = true
}: ProjectsSectionProps) => {
  const [showProjects, setShowProjects] = useState(showInitial);

  const toggleProjectsVisibility = () => {
    setShowProjects(prev => !prev);
  };

  return (
    <motion.div 
      className="mt-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl">Projets</h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleProjectsVisibility}
              className={cn(
                "transition-all duration-300 rounded-full hover:bg-primary/10", 
                showProjects ? "bg-primary/5" : ""
              )}
            >
              {showProjects ? 
                <ChevronUp className="h-4 w-4 transition-all duration-300 transform" /> : 
                <ChevronDown className="h-4 w-4 transition-all duration-300 transform" />
              }
            </Button>
          </motion.div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onNewProjectClick}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 
                             shadow-md rounded-full flex items-center justify-center w-10 h-10 p-0"
                >
                  <Rocket className="h-5 w-5 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="z-50 max-w-[200px]">
                Créer un nouveau projet
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <SavingsProjectList 
          projects={projects} 
          onProjectDeleted={onProjectDeleted} 
          showProjects={showProjects} 
        />
      </div>
    </motion.div>
  );
};
