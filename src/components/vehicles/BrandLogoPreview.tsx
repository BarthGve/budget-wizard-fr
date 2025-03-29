
import { Loader2 } from "lucide-react";

interface BrandLogoPreviewProps {
  url: string | null;
  isValid: boolean;
  isChecking: boolean;
  brand: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogoPreview = ({ 
  url, 
  isValid, 
  isChecking, 
  brand,
  size = "md"
}: BrandLogoPreviewProps) => {
  // Déterminer les dimensions en fonction de la taille
  const dimensions = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };
  
  const sizeClass = dimensions[size];
  
  if (isChecking) {
    return <Loader2 className={`${sizeClass} animate-spin text-gray-400`} />;
  }

  if (!url || !isValid) {
    // Si pas de logo valide, afficher la première lettre
    const firstLetter = brand.charAt(0).toUpperCase();
    return (
      <div className={`${sizeClass} flex items-center justify-center rounded-full bg-gray-200 text-gray-700`}>
        {firstLetter}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-1">
      <img 
        src={url} 
        alt={`Logo ${brand}`} 
        className="w-full h-full object-contain"
        onError={(e) => {
          // En cas d'erreur de chargement, remplacer par le fallback de la première lettre
          e.currentTarget.style.display = 'none';
          const target = e.currentTarget;
          const div = document.createElement('div');
          div.className = `${sizeClass} flex items-center justify-center rounded-full bg-gray-200 text-gray-700`;
          div.textContent = brand.charAt(0).toUpperCase();
          target.parentNode?.insertBefore(div, target.nextSibling);
        }}
      />
    </div>
  );
};
