
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  description: string;
  registerButtonText: string;
  isLoaded: boolean;
}

export const Hero = ({ title, description, registerButtonText, isLoaded }: HeroProps) => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className={`space-y-8 transform transition-all duration-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="group text-lg px-8 py-6 shadow-lg hover:shadow-primary/20"
              asChild
            >
              <Link to="/register">
                <UserPlus className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {registerButtonText}
              </Link>
            </Button>
          </div>
        </div>

        <div className={`transform-fix transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl" />
            <img
              src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png"
              alt="Budget Wizard"
              className="relative w-full h-auto max-w-2xl mx-auto transform-fix hover:scale-105 transition-transform duration-500"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
