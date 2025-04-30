
import { motion } from "framer-motion";
import { ChartBar, Shield, Target, Wallet } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface Feature {
  title: string;
  description: string;
}

interface FeaturesProps {
  features: Feature[];
  isLoaded: boolean;
}

export const Features = ({ features, isLoaded }: FeaturesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const icons = [Wallet, ChartBar, Target, Shield];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section ref={ref} id="features" className="py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Découvrez pourquoi nous sommes{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              les meilleurs
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Une solution complète pour gérer vos finances personnelles avec simplicité et efficacité
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map(({ title, description }, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-white/5 hover:bg-primary/5 border border-primary/10 
                  transition-all duration-500 hover:shadow-lg transform hover:-translate-y-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-4 rounded-xl bg-primary/10 text-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
