
import { useState, useEffect } from "react";

export const useVehicleBrandLogo = (brand: string) => {
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isLogoValid, setIsLogoValid] = useState(true);
  const [isCheckingLogo, setIsCheckingLogo] = useState(false);

  // Récupère l'URL du logo à partir du nom de la marque
  const getBrandLogoUrl = (brand: string) => {
    if (!brand) return null;
    const cleanBrand = brand.trim().toLowerCase();
    return `https://logo.clearbit.com/${cleanBrand}.com`;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkLogo = async () => {
      if (!brand?.trim()) {
        setPreviewLogoUrl(null);
        setIsLogoValid(true);
        setIsCheckingLogo(false);
        return;
      }

      try {
        setIsCheckingLogo(true);
        const logoUrl = getBrandLogoUrl(brand);
        
        if (!logoUrl) {
          setPreviewLogoUrl(null);
          setIsLogoValid(false);
          return;
        }

        setPreviewLogoUrl(logoUrl);

        // Créer une promesse pour charger l'image
        const loadImage = () => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = logoUrl;
          });
        };

        await loadImage();
        setIsLogoValid(true);
      } catch (error) {
        console.error("Erreur lors du chargement du logo:", error);
        setIsLogoValid(false);
      } finally {
        setIsCheckingLogo(false);
      }
    };

    // Attendre que l'utilisateur arrête de taper
    timeoutId = setTimeout(checkLogo, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [brand]);

  return {
    previewLogoUrl,
    isLogoValid,
    isCheckingLogo,
    getBrandLogoUrl
  };
};
