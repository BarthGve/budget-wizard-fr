
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeaturesProps {
  features: Feature[];
  isLoaded?: boolean;
}

export const Features = ({ features = [], isLoaded = true }: FeaturesProps) => {
  // S'assurer que features n'est jamais undefined
  const safeFeatures = features || [];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Fonctionnalités principales
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              BudgetWizard vous offre des outils puissants pour gérer vos finances personnelles
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          {safeFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className={cn(
                "flex flex-col space-y-4 p-6 bg-card rounded-xl border shadow-sm",
                "hover:shadow-md transition-shadow duration-300"
              )}
              variants={item}
            >
              <div className="p-2 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10">
                {feature.icon || <CheckCircle2 className="w-6 h-6 text-primary" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{feature.title || "Fonctionnalité"}</h3>
                <p className="text-muted-foreground">{feature.description || "Description de la fonctionnalité"}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
