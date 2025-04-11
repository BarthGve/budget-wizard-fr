
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { appConfig } from "@/config/app.config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Navbar = () => {
  // Utiliser le hook useMediaQuery pour détecter si l'écran est un mobile
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-7xl z-50 mt-2 sm:mt-4 rounded-2xl backdrop-blur-sm bg-background/70 dark:bg-background/90 border border-border shadow-lg">
  <div className="container mx-auto px-2 sm:px-6">
    <div className="flex items-center justify-between h-12 sm:h-16">
      <Link to="/" className="flex items-center gap-1 sm:gap-2">
        <img 
          src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif"
          alt="Budget Wizard"
          className="w-6 h-6 sm:w-8 sm:h-8 transform-fix"
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        />
        <span className="font-semibold text-secondary text-sm sm:text-lg">{appConfig.name}</span>
      </Link>
      
      <div className="flex items-center gap-1 sm:gap-4">
        {!isMobile && (
          <Link to="/changelog" className="text-sm  hover:text-primary transition-colors">
            Changelog
          </Link>
        )}
        <Link to="/login">
          <Button size={isMobile ? "sm" : "sm"} variant="ghost" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isMobile ? "Connexion" : appConfig.landing.hero.buttons.login}
          </Button>
        </Link>
      </div>
    </div>
  </div>
</nav>
  );
};

export default Navbar;
