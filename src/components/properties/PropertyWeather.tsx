
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, CloudRain, CloudSun, Sun, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyWeatherProps {
  latitude: number;
  longitude: number;
}

export const PropertyWeather = ({ latitude, longitude }: PropertyWeatherProps) => {
  const { data: weather, isLoading } = useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { latitude, longitude }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 1000 * 60 * 30, // Rafraîchir toutes les 30 minutes
  });

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <CloudSun className="h-8 w-8 text-gray-500" />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-4">
      {getWeatherIcon(weather.icon)}
      <div>
        <p className="text-lg font-medium">{Math.round(weather.temp)}°C</p>
        <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
      </div>
    </div>
  );
};
