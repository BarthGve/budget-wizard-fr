
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

    // Initialize map
    map.current = L.map(mapContainer.current).setView([46.227638, 2.213749], 5);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add navigation controls
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Create bounds object to fit all markers
    const bounds = L.latLngBounds([]);

    // Add markers for each property
    properties.forEach((property) => {
      if (property.latitude && property.longitude) {
        const marker = L.marker([Number(property.latitude), Number(property.longitude)])
          .bindPopup(`
            <h3 style="font-weight: bold; margin-bottom: 4px;">${property.name}</h3>
            <p style="margin: 0;">${property.address}</p>
          `)
          .addTo(map.current!);

        // Extend bounds to include this location
        bounds.extend([Number(property.latitude), Number(property.longitude)]);
      }
    });

    // Fit map to bounds if we have properties
    if (bounds.isValid()) {
      map.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
