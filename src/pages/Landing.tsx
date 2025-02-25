import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { appConfig } from "@/config/app.config";
import Navbar from "@/components/layout/Navbar";
import * as THREE from "three";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { TechStack } from "@/components/landing/TechStack";

const Landing = () => {
  const { landing } = appConfig;
  const [isLoaded, setIsLoaded] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    fetchTestimonials();
    initLogo3D();
  }, []);

  const initLogo3D = () => {
    if (!logoRef.current || !containerRef.current) return;

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
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  };

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        profile:profiles(full_name, avatar_url)
      `)
      .gte('rating', 4)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      setTestimonials(data);
    }
  };

  const technologies = [
    { icon: "/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png", name: "Lovable AI" },
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

      <Testimonials testimonials={testimonials} />

      <TechStack technologies={technologies} />
    </div>
  );
};

export default Landing;
