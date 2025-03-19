
interface BrandLogoPreviewProps {
  url: string | null;
  isValid: boolean;
  isChecking: boolean;
  brand: string;
}

export const BrandLogoPreview = ({ url, isValid, isChecking, brand }: BrandLogoPreviewProps) => {
  return (
    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white overflow-hidden">
      {isChecking ? (
        <div className="text-xs text-muted-foreground text-center">
          Chargement...
        </div>
      ) : url && isValid ? (
        <img
          src={url}
          alt="Logo marque"
          className="w-8 h-8 rounded-full object-contain"
        />
      ) : brand ? (
        <div className="text-xs text-muted-foreground text-center">
          Logo non trouvé
        </div>
      ) : null}
    </div>
  );
};
