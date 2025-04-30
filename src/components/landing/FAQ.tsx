
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const faqs = [
    {
      question: "Qu'est-ce que Budget Wizard ?",
      answer: "Budget Wizard est une application de gestion financière personnelle qui vous aide à suivre vos revenus, vos dépenses, vos crédits et vos objectifs d'épargne dans une interface simple et intuitive."
    },
    {
      question: "L'application est-elle gratuite ?",
      answer: "Budget Wizard propose une version gratuite avec toutes les fonctionnalités essentielles. Des options premium sont disponibles pour débloquer des fonctionnalités avancées comme des rapports détaillés et des prévisions financières personnalisées."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et respectons les normes de sécurité les plus strictes pour protéger vos informations financières. Nous ne vendons jamais vos données personnelles."
    },
    {
      question: "Comment puis-je importer mes transactions bancaires ?",
      answer: "Budget Wizard vous permet d'importer manuellement vos transactions ou de connecter votre compte bancaire pour une synchronisation automatique (selon votre pays et votre banque). Vous pouvez également importer des fichiers CSV de transactions."
    },
    {
      question: "Est-ce que je peux gérer plusieurs comptes ?",
      answer: "Oui, vous pouvez ajouter et suivre plusieurs comptes bancaires, cartes de crédit, prêts et investissements dans une seule vue consolidée."
    },
    {
      question: "L'application fonctionne-t-elle sur tous les appareils ?",
      answer: "Budget Wizard est disponible sur le web et peut être installée comme application Progressive Web App (PWA) sur vos appareils iOS et Android pour un accès facile depuis n'importe où."
    }
  ];

  return (
    <section ref={ref} id="faq" className="py-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto max-w-3xl">
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
            FAQ
          </motion.span>
          <h2 className="section-title">
            Questions fréquentes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour démarrer avec Budget Wizard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
              >
                <AccordionItem value={`item-${index}`} className="border-b border-primary/10">
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-muted-foreground mb-4">
            Vous avez d'autres questions ?
          </p>
          <a 
            href="mailto:support@budgetwizard.com" 
            className="inline-flex items-center font-medium text-primary hover:underline"
          >
            Contactez notre support
            <svg className="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
