
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { appConfig } from "@/config/app.config";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-950/70 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png"
              alt="Budget Wizard"
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">{appConfig.name}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                {appConfig.landing.hero.buttons.login}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                {appConfig.landing.hero.buttons.register}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
