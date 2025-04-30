
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect pour les éléments du héros
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Animation d'écriture pour le titre
  const titleWords = title.split(' ');
  
  // Effet de particules en arrière-plan
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    // Créer des particules flottantes
    const createParticles = () => {
      const container = particlesRef.current;
      if (!container) return;
      
      // Nettoyer les particules existantes
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Nombre de particules adapté à la taille de l'écran
      const particleCount = window.innerWidth < 768 ? 15 : 30;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Style de la particule
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        
        // Animation
        particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite alternate`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
      }
    };
    
    // Initialiser les particules
    createParticles();
    
    // Recréer les particules lors du redimensionnement
    window.addEventListener('resize', createParticles);
    return () => window.removeEventListener('resize', createParticles);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      ref={ref}
      className="relative min-h-[100vh] flex items-center pt-20 lg:pt-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Conteneur de particules */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10" />
      
      {/* Formes géométriques animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden -z-20">
        <motion.div
          className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-primary/5 backdrop-blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-primary/5 backdrop-blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <motion.div 
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            style={{ y, opacity }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="mb-6"
            >
              <h1 className="hero-heading mb-2">
                {titleWords.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { 
                        y: 0, 
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }
                      }
                    }}
                  >
                    <span className={i % 2 === 0 ? "gradient-text" : ""}>
                      {word}{" "}
                    </span>
                  </motion.span>
                ))}
              </h1>
            </motion.div>
            
            <motion.p 
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    delay: 0.4,
                    duration: 0.8
                  }
                }
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              {description}
            </motion.p>
            
            <motion.div 
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    delay: 0.6,
                    duration: 0.8
                  }
                }
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="/register">
                <button className="cta-button">
                  {registerButtonText}
                </button>
              </Link>
              
              <PwaInstallButton />
            </motion.div>
          </motion.div>
          
          {/* Illustration de l'application */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="perspective-1000">
              <motion.div 
                className="relative glass-card rounded-2xl p-6 shadow-xl"
                whileHover={{ 
                  rotateY: 5, 
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="aspect-[9/16] rounded-xl overflow-hidden border border-primary/20 shadow-inner">
                  {/* Dashboard simulé */}
                  <div className="bg-gradient-to-br from-background to-background/80 h-full p-4">
                    {/* En-tête avec animation de chargement */}
                    <div className="h-8 w-3/4 rounded-full bg-primary/10 mb-6 animate-pulse"></div>
                    
                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[1, 2, 3, 4].map((item) => (
                        <motion.div 
                          key={item}
                          className="h-24 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + (item * 0.1) }}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10"></div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Graphique */}
                    <motion.div 
                      className="h-40 rounded-xl bg-primary/5 mb-4 relative overflow-hidden"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      {/* Simuler un graphique */}
                      <div className="absolute bottom-0 inset-x-0 h-full">
                        <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
                          <path
                            d="M0 30 L0 20 C10 15, 20 30, 30 25 C40 20, 50 10, 60 15 C70 20, 80 30, 90 25 L100 20 L100 30 Z"
                            fill="rgba(var(--primary-rgb), 0.2)"
                            stroke="rgba(var(--primary-rgb), 0.5)"
                            strokeWidth="0.5"
                          />
                          <path
                            d="M0 20 C10 15, 20 30, 30 25 C40 20, 50 10, 60 15 C70 20, 80 30, 90 25 L100 20"
                            fill="none"
                            stroke="rgba(var(--primary-rgb), 1)"
                            strokeWidth="1"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                    </motion.div>
                    
                    {/* Boutons */}
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          className="h-12 rounded-lg bg-primary/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + (i * 0.1) }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Effet de reflet sur le verre */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </motion.div>
            </div>
            
            {/* Cercle décoratif derrière l'interface */}
            <div className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/5 -right-20 -bottom-40 blur-3xl" />
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
        <motion.button 
          onClick={scrollToFeatures}
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
          aria-label="Défiler vers le bas"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-sm font-medium mb-2">Découvrir</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.section>
  );
};
