
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChartBar, Shield, Target, Wallet, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Stats pour chaque fonctionnalité
  const featureStats = [
    { label: "Revenus moyens", value: "4500 €", trend: "+5%" },
    { label: "Charges mensuelles", value: "850 €", trend: "-2%" },
    { label: "Épargne mensuelle", value: "300 €", trend: "+10%" },
    { label: "Sécurité", value: "100%", trend: "" }
  ];

  return (
    <section ref={ref} id="features" className="py-20 md:py-32 px-4 relative">
      {/* Arrière-plan avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4 inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
          >
            FONCTIONNALITÉS
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Découvrez pourquoi nous sommes{' '}
            <span className="gradient-text">
              les meilleurs
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Une solution complète pour gérer vos finances personnelles avec simplicité et efficacité
          </p>
        </motion.div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="backdrop-blur-md bg-white/10 dark:bg-gray-950/10 border border-white/20">
              <TabsTrigger value="grid">Vue en grille</TabsTrigger>
              <TabsTrigger value="cards">Vue détaillée</TabsTrigger>
            </TabsList>
          </div>
        
          <TabsContent value="grid" className="space-y-8">
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
                    className="feature-card group"
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
                      
                      {/* Statistique associée */}
                      <div className="mt-4 pt-4 border-t border-primary/10 w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {featureStats[index].label}
                          </span>
                          <span className="font-semibold flex items-center gap-1">
                            {featureStats[index].value}
                            {featureStats[index].trend && (
                              <span className={`text-xs ${featureStats[index].trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {featureStats[index].trend}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="cards" className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {features.map(({ title, description }, index) => {
                const Icon = icons[index];
                return (
                  <motion.div
                    key={index}
                    className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="p-6 rounded-xl bg-primary/10 text-primary w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                      <p className="text-muted-foreground mb-6">{description}</p>
                      
                      <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer group">
                        <span>En savoir plus</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      
                      {/* Stat associée en bas */}
                      <div className="mt-6 pt-4 border-t border-primary/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {featureStats[index].label}
                          </span>
                          <div className="text-xl font-semibold flex items-center gap-1">
                            {featureStats[index].value}
                            {featureStats[index].trend && (
                              <span className={`text-sm ${featureStats[index].trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {featureStats[index].trend}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
