
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardTitle} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavingsProjectCard } from "../project-card/SavingsProjectCard";
import { SavingsProject } from "@/types/savings-project";
import { useNavigate } from "react-router-dom";

interface SavingsProjectsCarouselProps {
  projects: SavingsProject[];
  open: boolean;
  onClose: () => void;
}

export const SavingsProjectsCarousel = ({
  projects,
  open,
  onClose
}: SavingsProjectsCarouselProps) => {
  const navigate = useNavigate();
  const activeProjects = projects.filter(project => project.statut === 'actif');

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] p-2">
        <div className="relative p-6 flex flex-col space-y-6">
       

          <div className="space-y-2">
                <CardTitle className="text-lg flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-full",
                  "bg-quaternary/20 text-quaternary",
                  "dark:bg-quaternary/20 dark:text-quaternary"
                )}>
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="dark:text-white">Projets d'épargne</span>
                </div>
              </CardTitle>
    
            <p className="text-sm text-muted-foreground">
              {activeProjects.length} actif{activeProjects.length > 1 ? 's' : ''}
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {activeProjects.map((project) => (
                <CarouselItem key={project.id} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <SavingsProjectCard
                      project={project}
                      onDelete={() => {}}
                      onSelect={() => {}}
                      isVisible={true}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          <div className="flex justify-center pt-4">
            <Button onClick={() => {
              onClose();
              navigate("/savings");
            }}>
              Voir tous les projets
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
