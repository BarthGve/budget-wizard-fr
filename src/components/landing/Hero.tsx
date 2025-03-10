
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  title: string;
  description: string;
  registerButtonText: string;
  isLoaded?: boolean;
}

export const Hero = ({
  title,
  description,
  registerButtonText,
  isLoaded = true
}: HeroProps) => {
  const navigate = useNavigate();

  // Protéger contre les valeurs undefined
  const safeTitle = title || "Bienvenue sur BudgetWizard";
  const safeDescription = description || "Gérez vos finances personnelles avec facilité";
  const safeButtonText = registerButtonText || "S'inscrire";

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              >
                {safeTitle}
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {safeDescription}
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg"
                onClick={() => navigate("/register")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {safeButtonText}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto aspect-video overflow-hidden rounded-xl border bg-background object-cover shadow-xl sm:w-full lg:order-last"
          >
            <img
              src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif"
              width={550}
              height={310}
              alt="BudgetWizard Screenshot"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Gérer les erreurs de chargement d'image
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-black dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.7 : 0 }}
        transition={{ duration: 1 }}
      />
    </section>
  );
};
