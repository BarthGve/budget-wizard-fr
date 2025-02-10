
interface GeocodingResult {
  latitude: string;
  longitude: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: data[0].lat,
        longitude: data[0].lon,
      };
    }
    throw new Error("Adresse introuvable");
  } catch (error) {
    console.error("Erreur de géocodage:", error);
    throw error;
  }
};
