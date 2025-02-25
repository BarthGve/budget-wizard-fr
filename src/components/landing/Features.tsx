
import { ChartBar, Shield, Target, Wallet } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface FeaturesProps {
  features: Feature[];
  isLoaded: boolean;
}

export const Features = ({ features, isLoaded }: FeaturesProps) => {
  const icons = [Wallet, ChartBar, Target, Shield];

  return (
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
        {features.map(({ title, description }, index) => {
          const Icon = icons[index];
          return (
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
          );
        })}
      </div>
    </div>
  );
};
