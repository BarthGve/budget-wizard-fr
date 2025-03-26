
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyWeather } from "@/components/properties/PropertyWeather";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationWeatherCardProps {
  latitude: number;
  longitude: number;
  address: string;
}

export const LocationWeatherCard = ({ latitude, longitude, address }: LocationWeatherCardProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // Initialiser la carte si elle n'existe pas encore
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Ajouter la couche de tuiles OSM
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    } else {
      // Mettre à jour la vue si la carte existe déjà
      mapInstanceRef.current.setView([latitude, longitude], 13);
    }

    // Ajouter le marqueur
    const marker = L.marker([latitude, longitude])
      .addTo(mapInstanceRef.current)
      .bindPopup(address)
      .openPopup();

    // Nettoyer lors du démontage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, address]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl font-medium">
          <MapPin className="h-5 w-5 mr-2 text-blue-500" /> 
          Localisation & Météo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div ref={mapRef} className="h-48 rounded-md overflow-hidden"></div>
          
          <div className="pt-2 border-t">
            <PropertyWeather latitude={latitude} longitude={longitude} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
