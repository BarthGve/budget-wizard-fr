
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PwaInstallButton } from "./PwaInstallButton";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  description: string;
  registerButtonText: string;
  isLoaded: boolean;
}

export const Hero = ({ 
  title, 
  description, 
  registerButtonText,
  isLoaded
}: HeroProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 lg:pt-0 pb-16 px-4 md:px-6 overflow-hidden">
      {/* Arrière-plan avec gradient animé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
      />
      
      {/* Éléments flottants en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-primary/5"
            initial={{ 
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0
            }}
            animate={{ 
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 1],
              opacity: [0.3, 0.7]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <motion.div 
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter mb-6"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl"
            >
              {description}
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="/register">
                <Button size="lg" className="gap-2 rounded-full shadow-lg hover:shadow-xl transition-all">
                  {registerButtonText}
                </Button>
              </Link>
              
              <PwaInstallButton />
            </motion.div>
          </motion.div>
          
          {/* Illustration de l'application */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="aspect-[9/16] rounded-xl overflow-hidden border border-primary/20 shadow-inner">
                {/* Simuler un tableau de bord */}
                <div className="bg-gradient-to-br from-background to-background/80 h-full p-4">
                  <div className="h-8 w-3/4 rounded-full bg-primary/10 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-24 rounded-xl bg-primary/5 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10"></div>
                    </div>
                    <div className="h-24 rounded-xl bg-primary/5 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10"></div>
                    </div>
                  </div>
                  <div className="h-40 rounded-xl bg-primary/5 mb-4"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-lg bg-primary/10"></div>
                    <div className="h-16 rounded-lg bg-primary/10"></div>
                    <div className="h-16 rounded-lg bg-primary/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Indicateur de défilement */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <button 
          onClick={scrollToFeatures}
          className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors"
          aria-label="Défiler vers le bas"
        >
          <span className="text-sm font-medium mb-2">Découvrir</span>
          <ChevronDown className="animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
};
