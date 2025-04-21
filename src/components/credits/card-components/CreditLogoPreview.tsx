
/**
 * Affiche le logo du crédit dans un style compact.
 *
 * Props :
 * - url : string | null — URL du logo
 * - isValid : boolean — le logo est-il valide ?
 * - isChecking : boolean — en cours de vérification ?
 * - name : string — nom du crédit (pour fallback lettre)
 * - className : string optionnel
 */
import { cn } from "@/lib/utils";

interface CreditLogoPreviewProps {
  url: string | null;
  isValid: boolean;
  isChecking?: boolean;
  name: string;
  className?: string;
}

export const CreditLogoPreview = ({
  url,
  isValid,
  isChecking,
  name,
  className,
}: CreditLogoPreviewProps) => {
  // En cours de vérification : loader
  if (isChecking) {
    return (
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-400 animate-pulse",
          className
        )}
      >
        ...
      </div>
    );
  }

  // Logo valide trouvé
  if (url && isValid) {
    return (
      <img
        src={url}
        alt={`Logo ${name}`}
        className={cn(
          "w-10 h-10 object-contain rounded-md border bg-white dark:bg-gray-900",
          className
        )}
        style={{ background: "white" }}
      />
    );
  }

  // Fallback : première lettre du nom
  return (
    <div
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg",
        className
      )}
      aria-label={name}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
