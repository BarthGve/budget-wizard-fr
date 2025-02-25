
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Wallet, Users, Clock, Target, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { appConfig } from "@/config/app.config";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

const Landing = () => {
  const { landing } = appConfig;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <div 
            className={`
              transform perspective-1000 transition-all duration-1000 ease-out
              ${isLoaded ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-20 rotate-12 opacity-0'}
              hover:scale-105 hover:rotate-3 transition-transform duration-500
            `}
          >
            <img 
              src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png"
              alt="Budget Wizard Logo"
              className="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
          <div className={`space-y-6 max-w-3xl mx-auto transition-all duration-700 delay-300 transform
            ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent pb-1 leading-normal">
              {landing.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {landing.hero.description}
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mt-8 transition-all duration-700 delay-500 transform
            ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link to="/login" className="flex-1">
              <Button className="w-full group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" size="lg">
                <LogIn className="mr-2 group-hover:translate-x-1 transition-transform" />
                {landing.hero.buttons.login}
              </Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button variant="outline" className="w-full group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" size="lg">
                <UserPlus className="mr-2 group-hover:scale-110 transition-transform" />
                {landing.hero.buttons.register}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { icon: Wallet, index: 0 },
            { icon: Users, index: 1 },
            { icon: Clock, index: 2 },
            { icon: Target, index: 3 }
          ].map(({ icon: Icon, index }) => (
            <div 
              key={index}
              className={`
                group p-6 rounded-2xl bg-card hover:bg-primary/5 transition-all duration-500
                border hover:shadow-xl transform hover:-translate-y-1
                ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              `}
              style={{
                transitionDelay: `${700 + index * 100}ms`
              }}
            >
              <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-semibold mb-2">{landing.features[index].title}</h3>
              <p className="text-muted-foreground">{landing.features[index].description}</p>
            </div>
          ))}
        </div>

        {/* Security Banner */}
        <div 
          className={`
            mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border
            transform transition-all duration-700 hover:shadow-xl
            ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}
          style={{ transitionDelay: '1100ms' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-primary transform transition-transform group-hover:scale-110" />
              <div>
                <h3 className="text-xl font-semibold mb-1">{landing.security.title}</h3>
                <p className="text-muted-foreground">{landing.security.description}</p>
              </div>
            </div>
            <Link to="/register">
              <Button 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {landing.security.button}
                <UserPlus className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
