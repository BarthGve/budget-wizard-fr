
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PwaInstallButton } from "./PwaInstallButton";

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

  return (
    <section className="relative pt-20 md:pt-24 lg:pt-32 px-4 md:px-6 mx-auto max-w-7xl">
      <motion.div 
        className="flex flex-col items-center text-center"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 sm:mb-6 px-2"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="max-w-[600px] text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg px-2"
        >
          {description}
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap gap-3 sm:gap-4 justify-center"
        >
          <Link to="/register">
            <Button size="lg" className="gap-1 rounded-full">
              {registerButtonText}
            </Button>
          </Link>
          
          <PwaInstallButton />
        </motion.div>
      </motion.div>
    </section>
  );
};
