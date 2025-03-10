
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialsProps {
  testimonials: {
    id: string;
    rating: number;
    review: string;
    status: string;
    profile: {
      full_name: string;
      avatar_url: string | null;
    };
  }[];
}

export const Testimonials = ({ testimonials = [] }: TestimonialsProps) => {
  // Protection supplémentaire contre les valeurs undefined
  const safeTestimonials = testimonials || [];
  
  // Si aucun témoignage, ne pas rendre la section
  if (!safeTestimonials.length) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-background relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ce que nos utilisateurs disent
          </motion.h2>
          <motion.p 
            className="mt-4 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Découvrez l'expérience de nos utilisateurs avec BudgetWizard
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={cn(
                "bg-card p-6 rounded-xl border shadow-sm",
                "hover:shadow-md transition-shadow duration-300"
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={testimonial.profile?.avatar_url || ""} alt={testimonial.profile?.full_name || "Utilisateur"} />
                  <AvatarFallback>{testimonial.profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.profile?.full_name || "Utilisateur"}</p>
                  <div className="flex items-center">
                    {Array.from({ length: testimonial.rating || 0 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.review || ""}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
