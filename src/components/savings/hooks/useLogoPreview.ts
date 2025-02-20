
import { useState, useEffect } from "react";

const getFaviconUrl = (domain: string) => {
  if (!domain) return null;
  const cleanDomain = domain.trim().toLowerCase();
  if (!cleanDomain.startsWith('http')) {
    return `https://logo.clearbit.com/${cleanDomain}`;
  }
  const url = new URL(cleanDomain);
  return `https://logo.clearbit.com/${url.hostname}`;
};

export const useLogoPreview = (domain: string) => {
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isLogoValid, setIsLogoValid] = useState(true);
  const [isCheckingLogo, setIsCheckingLogo] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkLogo = async () => {
      if (!domain?.trim()) {
        setPreviewLogoUrl(null);
        setIsLogoValid(true);
        setIsCheckingLogo(false);
        return;
      }

      try {
        setIsCheckingLogo(true);
        const logoUrl = getFaviconUrl(domain);
        
        if (!logoUrl) {
          setPreviewLogoUrl(null);
          setIsLogoValid(false);
          return;
        }

        setPreviewLogoUrl(logoUrl);

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
        console.error("Error loading logo:", error);
        setIsLogoValid(false);
      } finally {
        setIsCheckingLogo(false);
      }
    };

    timeoutId = setTimeout(checkLogo, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [domain]);

  return {
    previewLogoUrl,
    isLogoValid,
    isCheckingLogo,
    getFaviconUrl
  };
};
