
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsProjectList } from "@/components/savings/SavingsProjectList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SavingsProject } from "@/types/savings-project";

interface ProjectsSectionProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
  showInitial?: boolean;
}

export const ProjectsSection = ({ 
  projects, 
  onProjectDeleted,
  showInitial = true
}: ProjectsSectionProps) => {
  const [showProjects, setShowProjects] = useState(showInitial);

  const toggleProjectsVisibility = () => {
    setShowProjects(prev => !prev);
  };

  return (
    <motion.div 
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
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
      </div>
      
      <SavingsProjectList 
        projects={projects} 
        onProjectDeleted={onProjectDeleted} 
        showProjects={showProjects} 
      />
    </motion.div>
  );
};
