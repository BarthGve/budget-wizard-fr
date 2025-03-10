
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { appConfig } from "@/config/app.config";
import Navbar from "@/components/layout/Navbar";
import * as THREE from "three";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { TechStack } from "@/components/landing/TechStack";
import { useLatestVersion } from "@/hooks/useLatestVersion";

const Landing = () => {
  const { landing } = appConfig;
  const [isLoaded, setIsLoaded] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { latestVersion } = useLatestVersion();

  useEffect(() => {
    setIsLoaded(true);
    fetchTestimonials();
    
    // Protection contre les problèmes potentiels avec Three.js
    try {
      initLogo3D();
    } catch (error) {
      console.error("Erreur lors de l'initialisation du logo 3D:", error);
    }
  }, []);

  const initLogo3D = () => {
    // Vérification supplémentaire pour éviter les erreurs undefined
    if (!logoRef.current || !containerRef.current) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(80, 80);

      const texture = new THREE.TextureLoader().load(logoRef.current.src);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const cube = new THREE.Mesh(geometry, material);
      
      scene.add(cube);
      camera.position.z = 2;

      containerRef.current.appendChild(renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);
        if (cube) {
          cube.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
      };

      animate();
    } catch (error) {
      console.error("Erreur dans l'animation 3D:", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTestimonials(data || []);
      } else if (error) {
        console.error("Erreur lors du chargement des témoignages:", error);
      }
    } catch (error) {
      console.error("Exception lors du chargement des témoignages:", error);
      setTestimonials([]);
    }
  };

  const technologies = [
    { icon: "/lovable-uploads/icone_lovable.jpeg", name: "Lovable AI" },
    { icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg", name: "React" },
    { icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", name: "TypeScript" },
    { icon: "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg", name: "Tailwind CSS" },
    { icon: "https://app.supabase.com/img/supabase-logo.svg", name: "Supabase" },
    { icon: "https://ui.shadcn.com/favicon.ico", name: "shadcn/ui" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Navbar />
      
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

      <Testimonials testimonials={testimonials || []} />

      <TechStack 
        technologies={technologies} 
        appVersion={latestVersion || appConfig.version}
      />

      {/* Référence cachée pour le logo 3D */}
      <div className="hidden">
        <img ref={logoRef} src="/lovable-uploads/icone_lovable.jpeg" alt="Logo" />
        <div ref={containerRef}></div>
      </div>
    </div>
  );
};

export default Landing;
