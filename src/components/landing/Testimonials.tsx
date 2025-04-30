
import { useEffect, useState, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TestimonialProfile {
  full_name: string;
  avatar_url: string;
}

interface Testimonial {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  profile: TestimonialProfile;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Filtrer les témoignages par note
  const filteredTestimonials = filter 
    ? testimonials.filter(t => t.rating === filter) 
    : testimonials;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const scrollToNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToNext();
    }, 10000);  // Auto scroll every 10 seconds

    return () => clearInterval(interval);
  }, [scrollToNext]);

  // Regrouper les témoignages par 3
  const testimonialsChunks = [];
  for (let i = 0; i < filteredTestimonials.length; i += 3) {
    testimonialsChunks.push(filteredTestimonials.slice(i, i + 3));
  }

  // Statistiques des témoignages
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : 0;
  
  const ratingsCount = [0, 0, 0, 0, 0]; // index 0 = 1 étoile, index 4 = 5 étoiles
  testimonials.forEach(t => {
    if (t.rating >= 1 && t.rating <= 5) {
      ratingsCount[t.rating - 1]++;
    }
  });

  return (
    <section ref={ref} className="py-20 md:py-32 px-4" id="testimonials">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="mb-12 text-center"
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
            TÉMOIGNAGES
          </motion.span>
          <h2 className="section-title">
            Ce que nos utilisateurs disent de nous
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Découvrez comment Budget Wizard aide nos utilisateurs à transformer leur gestion financière au quotidien
          </p>
          
          {/* Sommaire des évaluations */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold gradient-text mb-2">{averageRating}</div>
              <div className="flex mb-1">
                {renderStars(Math.round(Number(averageRating)))}
              </div>
              <p className="text-sm text-muted-foreground">
                Basé sur {testimonials.length} avis
              </p>
            </div>
            
            <div className="w-px h-16 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            
            <div className="flex flex-col gap-1 w-full max-w-xs">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingsCount[stars - 1];
                const percentage = testimonials.length > 0 
                  ? Math.round((count / testimonials.length) * 100) 
                  : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex">{renderStars(stars)}</div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[30px] text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button 
              variant={filter === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setFilter(null)}
            >
              Tous
            </Button>
            {[5, 4, 3, 2, 1].map(rating => (
              <Button
                key={rating}
                variant={filter === rating ? "default" : "outline"}
                size="sm"
                className="rounded-full flex items-center gap-1"
                onClick={() => setFilter(rating)}
              >
                {rating} <Star className="h-3 w-3 fill-current" />
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-b from-primary/5 to-transparent border border-primary/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-20" />
          
          <div className="relative">
            <AnimatePresence mode="wait">
              {testimonialsChunks.length > 0 ? (
                <Carousel 
                  setApi={setApi}
                  className="w-full"
                  opts={{ 
                    align: "start",
                    loop: true
                  }}
                >
                  <CarouselContent className="p-2">
                    {testimonialsChunks.map((chunk, index) => (
                      <CarouselItem key={index} className="md:basis-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {chunk.map((testimonial) => (
                            <motion.div
                              key={testimonial.id}
                              className="testimonial-card transform transition-transform duration-300"
                              whileHover={{ 
                                scale: 1.02,
                                boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.15)" 
                              }}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <Avatar className="h-12 w-12 border-2 border-primary/10">
                                  <AvatarImage src={testimonial.profile.avatar_url} />
                                  <AvatarFallback>
                                    {testimonial.profile.full_name?.[0]?.toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-semibold">
                                      {testimonial.profile.full_name}
                                    </p>
                                    <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {format(new Date(testimonial.created_at), 'PP', { locale: fr })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <div className="flex space-x-0.5">
                                      {renderStars(testimonial.rating)}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                      <Check className="w-3 h-3" /> 
                                      <span>Vérifié</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h3 className="text-lg font-medium mb-2">{testimonial.title}</h3>
                              <p className="text-muted-foreground">
                                {testimonial.content}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: count }).map((_, i) => (
                      <button
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all ${
                          current === i ? "w-6 bg-primary" : "bg-primary/20"
                        }`}
                        onClick={() => api?.scrollTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="hidden md:flex">
                    <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                </Carousel>
              ) : (
                <motion.div 
                  key="empty" 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-muted-foreground">
                    Aucun témoignage ne correspond au filtre sélectionné.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
