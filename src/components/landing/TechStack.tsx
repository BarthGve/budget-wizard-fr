
import { motion } from "framer-motion";
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
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Propulsé par les meilleures technologies
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Notre application est construite avec les technologies les plus modernes pour vous offrir 
            une expérience utilisateur fluide et des performances exceptionnelles.
          </p>
        </motion.div>

        <div className="relative overflow-hidden py-10">
          <div className="animate-marquee flex space-x-8">
            {[...technologies, ...technologies].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-4 flex flex-col items-center justify-center w-32 h-32 bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all">
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

        <div className="mt-12 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm">
            <span className="text-muted-foreground">Version actuelle:</span>{" "}
            <span className="font-semibold">{appVersion}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
