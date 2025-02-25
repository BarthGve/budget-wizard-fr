
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { appConfig } from "@/config/app.config";

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 rounded-2xl backdrop-blur-sm bg-white/70 dark:bg-gray-950/70 border shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png"
              alt="Budget Wizard"
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">{appConfig.name}</span>
          </Link>
          
          <div className="flex justify-center w-32">
            <Link to="/login">
              <Button size="sm" variant="ghost" className="gap-2">
                <LogIn className="w-4 h-4" />
                {appConfig.landing.hero.buttons.login}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
