
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-b from-primary/5 to-transparent border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-20" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ce que nos utilisateurs disent de nous
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-primary/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.profile.avatar_url} />
                    <AvatarFallback>
                      {testimonial.profile.full_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {testimonial.profile.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(testimonial.created_at), 'PP', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-lg font-medium mb-2">{testimonial.title}</p>
                <p className="text-muted-foreground">
                  {testimonial.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
