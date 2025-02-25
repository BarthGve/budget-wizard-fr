import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Wallet, ChartBar, Target, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { appConfig } from "@/config/app.config";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Landing = () => {
  const { landing } = appConfig;
  const [isLoaded, setIsLoaded] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        profile:profiles(full_name, avatar_url)
      `)
      .gte('rating', 4)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      setTestimonials(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className={`space-y-8 transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {landing.hero.title}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              {landing.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="group text-lg px-8 py-6 shadow-lg hover:shadow-primary/20"
                asChild
              >
                <Link to="/login">
                  <LogIn className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  {landing.hero.buttons.login}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group text-lg px-8 py-6"
                asChild
              >
                <Link to="/register">
                  <UserPlus className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  {landing.hero.buttons.register}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right column - Image */}
          <div className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl" />
              <img
                src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.png"
                alt="Budget Wizard"
                className="relative w-full h-auto max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Découvrez pourquoi nous sommes{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              les meilleurs
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Une solution complète pour gérer vos finances personnelles avec simplicité et efficacité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Wallet, title: landing.features[0].title, description: landing.features[0].description },
            { icon: ChartBar, title: landing.features[1].title, description: landing.features[1].description },
            { icon: Target, title: landing.features[2].title, description: landing.features[2].description },
            { icon: Shield, title: landing.features[3].title, description: landing.features[3].description }
          ].map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl bg-white/5 hover:bg-primary/5 border border-primary/10 
                transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1
                ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${800 + index * 100}ms` }}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
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
    </div>
  );
};

export default Landing;
