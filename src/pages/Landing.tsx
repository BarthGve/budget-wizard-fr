
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { appConfig } from "@/config/app.config";
import Navbar from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { TechStack } from "@/components/landing/TechStack";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Demonstration } from "@/components/landing/Demonstration";

const Landing = () => {
  const { landing } = appConfig;
  const [isLoaded, setIsLoaded] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const { latestVersion } = useLatestVersion();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerRef = useRef<HTMLElement>(null);
  
  // Animation pour l'opacité du header au scroll
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  useEffect(() => {
    setIsLoaded(true);
    fetchTestimonials();
    
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        profile:profiles(full_name, avatar_url)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTestimonials(data);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const technologies = [
    { icon: "/lovable-uploads/icone_lovable.jpeg", name: "Lovable AI" },
    { icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg", name: "React" },
    { icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", name: "TypeScript" },
    { icon: "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg", name: "Tailwind CSS" },
    { icon: "https://app.supabase.com/img/supabase-logo.svg", name: "Supabase" },
    { icon: "https://ui.shadcn.com/favicon.ico", name: "shadcn/ui" },
    { icon: "https://framerusercontent.com/images/48ha9ZR9oZQGQ6gZ8YUfElP3T0A.png", name: "Framer Motion" },
    { icon: "https://www.chartjs.org/img/chartjs-logo.svg", name: "Recharts" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background/90 overflow-x-hidden">
      <motion.header 
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="fixed top-0 w-full z-50"
      >
        <Navbar />
      </motion.header>
      
      <Hero
        title={landing.hero.title}
        description={landing.hero.description}
        registerButtonText={landing.hero.buttons.register}
        isLoaded={isLoaded}
      />

      <Features 
        features={landing.features}
        isLoaded={isLoaded}
      />

      <Demonstration />

      <Testimonials testimonials={testimonials} />

      <TechStack 
        technologies={technologies} 
        appVersion={latestVersion || appConfig.version}
      />

      <FAQ />

      <Footer />
      
      {/* Blobs animés en arrière-plan */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="blob-shape w-[500px] h-[500px] -top-64 -left-20 bg-primary/10 animate-blob"
          style={{ animationDelay: "0s" }}
        ></div>
        <div 
          className="blob-shape w-[600px] h-[600px] top-1/3 -right-40 bg-secondary/10 animate-blob"  
          style={{ animationDelay: "2s" }}
        ></div>
        <div 
          className="blob-shape w-[400px] h-[400px] bottom-0 left-1/4 bg-tertiary/10 animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      
      {/* Bouton de retour en haut de page */}
      <motion.button
        className="fixed right-6 bottom-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-50"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollToTop ? 1 : 0, 
          scale: showScrollToTop ? 1 : 0.5,
          pointerEvents: showScrollToTop ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Retour en haut"
      >
        <ChevronUp size={20} />
      </motion.button>
    </div>
  );
};

export default Landing;
