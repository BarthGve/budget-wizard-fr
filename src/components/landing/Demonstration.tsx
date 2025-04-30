
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Demonstration = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  const tabs = [
    { id: "dashboard", label: "Tableau de bord", image: "/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif" },
    { id: "budget", label: "Suivi budgétaire", image: "/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif" },
    { id: "savings", label: "Épargne", image: "/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif" },
    { id: "credits", label: "Crédits", image: "/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif" }
  ];
  
  const features = {
    dashboard: [
      { title: "Vue d'ensemble", description: "Visualisez instantanément votre situation financière" },
      { title: "Revenus et dépenses", description: "Suivez les mouvements d'argent en temps réel" },
      { title: "Analyses", description: "Des graphiques interactifs pour comprendre vos finances" }
    ],
    budget: [
      { title: "Catégorisation", description: "Classement automatique de vos dépenses par catégorie" },
      { title: "Alertes", description: "Notifications en cas de dépassement de budget" },
      { title: "Prévisions", description: "Anticipez vos dépenses futures" }
    ],
    savings: [
      { title: "Objectifs d'épargne", description: "Définissez et suivez vos objectifs financiers" },
      { title: "Épargne automatique", description: "Mettez de côté sans y penser" },
      { title: "Rendements", description: "Visualisez la croissance de votre épargne" }
    ],
    credits: [
      { title: "Suivi des emprunts", description: "Visualisez tous vos crédits en un coup d'œil" },
      { title: "Échéanciers", description: "Calendrier des remboursements avec alertes" },
      { title: "Simulation", description: "Calculez l'impact d'un nouveau crédit sur votre budget" }
    ]
  };

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 relative" id="demo">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
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
            DÉMONSTRATION
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Voyez <span className="gradient-text">en action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Découvrez les fonctionnalités clés qui vous aideront à reprendre le contrôle de vos finances
          </p>
        </motion.div>
        
        <Tabs 
          defaultValue="dashboard" 
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full mt-12"
        >
          {/* Onglets */}
          <div className="flex justify-center mb-12">
            <TabsList className="backdrop-blur-md bg-white/10 dark:bg-gray-950/10 p-1 border border-white/20">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Contenu des onglets */}
          {tabs.map(tab => (
            <TabsContent 
              key={tab.id}
              value={tab.id} 
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <motion.div
                className="grid md:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Capture d'écran */}
                <motion.div 
                  className="order-2 md:order-1 perspective-1000"
                  initial={{ opacity: 0, y: 20, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                    {/* Image simulée de l'interface */}
                    <div className="bg-gradient-to-br from-background/90 to-background/70 aspect-video rounded-xl p-6 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
                            <img 
                              src={tab.image} 
                              alt={tab.label} 
                              className="w-10 h-10"
                            />
                          </div>
                          <h3 className="text-xl font-semibold gradient-text">{tab.label}</h3>
                          <p className="text-sm text-muted-foreground mt-2">Capture d'écran de démonstration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Fonctionnalités */}
                <motion.div 
                  className="order-1 md:order-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-6">
                    {tab.label}
                  </h3>
                  
                  <div className="space-y-6">
                    {features[tab.id as keyof typeof features].map((feature, index) => (
                      <motion.div 
                        key={index}
                        className="flex gap-4 items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      >
                        <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{feature.title}</h4>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.a
                    href="/register"
                    className="cta-button inline-flex mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Commencer gratuitement
                  </motion.a>
                </motion.div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
