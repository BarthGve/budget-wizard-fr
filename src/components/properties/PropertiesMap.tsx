
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';

interface PropertiesMapProps {
  properties: Property[];
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    // Fetch Mapbox token from Supabase
    const fetchMapboxToken = async () => {
      const { data: secret } = await supabase.from('app_settings')
        .select('value')
        .eq('name', 'MAPBOX_TOKEN')
        .single();

      if (secret?.value) {
        setMapboxToken(secret.value);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
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

    return () => {
      map.current?.remove();
    };
  }, [properties, mapboxToken]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
