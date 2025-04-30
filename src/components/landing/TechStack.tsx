
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";

interface Technology {
  icon: string;
  name: string;
}

interface TechStackProps {
  technologies: Technology[];
  appVersion: string;
}

export const TechStack = ({ technologies, appVersion }: TechStackProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section ref={ref} id="techstack" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div 
          className="text-center mb-12"
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
            TECHNOLOGIES
          </motion.span>
          <h2 className="section-title">
            Propulsé par les meilleures technologies
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Notre application est construite avec les technologies les plus modernes pour vous offrir 
            une expérience utilisateur fluide et des performances exceptionnelles.
          </p>
        </motion.div>

        {/* Technologies en mosaïque 3D */}
        <div className="perspective-1000 mx-auto max-w-4xl mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, rotateX: 45 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: 45 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                className="backface-hidden"
              >
                <Card className="tech-card h-32">
                  <img 
                    src={tech.icon} 
                    alt={tech.name}
                    className="w-12 h-12 object-contain mb-3" 
                  />
                  <p className="text-sm font-medium text-center">{tech.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Caractéristiques techniques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <motion.div
            className="glass-card p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold">Performances</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Application optimisée pour des temps de chargement éclair et une expérience utilisateur fluide.
            </p>
          </motion.div>
          
          <motion.div
            className="glass-card p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="font-semibold">Sécurité</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Protection de vos données avec un chiffrement de bout en bout et des mises à jour régulières.
            </p>
          </motion.div>
          
          <motion.div
            className="glass-card p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h3 className="font-semibold">Support</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Assistance technique réactive et documentation complète pour vous accompagner.
            </p>
          </motion.div>
        </div>

        <div className="text-center">
          <motion.div 
            className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="text-muted-foreground">Version actuelle:</span>{" "}
            <span className="font-semibold">{appVersion}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
