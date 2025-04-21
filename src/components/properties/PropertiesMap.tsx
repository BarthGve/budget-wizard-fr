
// Ajout d'un container arrondi et ombré, cohérent avec les autres maps de l'app
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types/property';

interface PropertiesMapProps {
  properties: Property[];
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialisation de la map Leaflet
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
    }).setView([46.227638, 2.213749], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Contrôles de navigation
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Extension des bounds pour les markers
    const bounds = L.latLngBounds([]);
    properties.forEach((property) => {
      if (property.latitude && property.longitude) {
        const marker = L.marker([Number(property.latitude), Number(property.longitude)])
          .bindPopup(`
            <h3 style="font-weight: bold; margin-bottom: 4px;">${property.name}</h3>
            <p style="margin: 0;">${property.address}</p>
          `)
          .addTo(map.current!);

        bounds.extend([Number(property.latitude), Number(property.longitude)]);
      }
    });

    if (bounds.isValid()) {
      map.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }

    setTimeout(() => {
      map.current?.invalidateSize();
    }, 100);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties]);

  return (
    <div className="relative w-full h-[340px] md:h-[400px] overflow-hidden rounded-2xl shadow-xl border bg-white/80 dark:bg-quaternary-900/30 backdrop-blur-md">
      {/* Le contenu de la map */}
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl" />
      {/* Effet de glassmorphism pour mettre la map dans la même "carte" graphique */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-transparent to-background/10" />
    </div>
  );
};
