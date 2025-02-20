
interface LogoPreviewProps {
  url: string | null;
  isValid: boolean;
  isChecking: boolean;
  domain: string;
}

export const LogoPreview = ({ url, isValid, isChecking, domain }: LogoPreviewProps) => {
  return (
    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white overflow-hidden">
      {isChecking ? (
        <div className="text-xs text-muted-foreground text-center">
          Chargement...
        </div>
      ) : url && isValid ? (
        <img
          src={url}
          alt="Logo preview"
          className="w-8 h-8 object-contain"
        />
      ) : domain ? (
        <div className="text-xs text-muted-foreground text-center">
          Logo non trouvé
        </div>
      ) : null}
    </div>
  );
};
