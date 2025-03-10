
import { motion } from "framer-motion";

interface Technology {
  icon: string;
  name: string;
}

interface TechStackProps {
  technologies: Technology[];
  appVersion?: string;
}

export const TechStack = ({ technologies = [], appVersion = "1.0.0" }: TechStackProps) => {
  // S'assurer que technologies n'est jamais undefined
  const safeTech = technologies || [];
  
  return (
    <section className="py-12 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Technologies utilisées
            </h2>
            <p className="max-w-[700px] text-muted-foreground">
              BudgetWizard est construit avec des technologies modernes pour vous offrir la meilleure expérience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 mt-8"
          >
            {safeTech.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative h-16 w-16 overflow-hidden">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      // Gérer les erreurs de chargement d'image
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <p className="text-sm font-medium">{tech.name}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-xs text-muted-foreground"
          >
            <p>Version {appVersion || "1.0.0"}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
