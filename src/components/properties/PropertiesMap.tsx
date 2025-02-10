
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PropertiesMapProps {
  properties: Property[];
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch Mapbox token from Supabase
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('name', 'MAPBOX_TOKEN')
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          toast.error("Token Mapbox non trouvé");
          setIsLoading(false);
          return;
        }

        console.log('Mapbox token:', data.value); // Debug log
        setMapboxToken(data.value);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast.error("Erreur lors du chargement de la carte");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isLoading) return;

    console.log('Initializing map with token:', mapboxToken); // Debug log

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      const bounds = new mapboxgl.LngLatBounds();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Changed to streets style for better visibility
        zoom: 5,
        center: [2.213749, 46.227638], // Centre de la France
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add markers for each property
      properties.forEach((property) => {
        if (property.latitude && property.longitude) {
          // Create marker element
          const marker = new mapboxgl.Marker()
            .setLngLat([property.longitude, property.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                  `<h3 style="font-weight: bold; margin-bottom: 4px;">${property.name}</h3>
                   <p style="margin: 0;">${property.address}</p>`
                )
            )
            .addTo(map.current!);

          // Extend bounds to include this location
          bounds.extend([property.longitude, property.latitude]);
        }
      });

      // Fit map to bounds if we have properties
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }

      // Add error handling for map load
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast.error("Erreur lors du chargement de la carte");
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error("Erreur lors de l'initialisation de la carte");
    }

    return () => {
      map.current?.remove();
    };
  }, [properties, mapboxToken, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md bg-muted animate-pulse" />
    );
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Impossible de charger la carte</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
