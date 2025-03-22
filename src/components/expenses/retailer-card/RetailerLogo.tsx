
import { Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetailerLogoProps {
  logoUrl?: string;
  name: string;
}

export function RetailerLogo({ logoUrl, name }: RetailerLogoProps) {
  return (
    <>
      {logoUrl ? (
        <div className={cn(
          "rounded-full overflow-hidden border",
          "border-gray-100 dark:border-gray-700",
          "w-10 h-10 flex items-center justify-center"
        )}>
          <img 
            src={logoUrl} 
            alt={name} 
            className="w-9 h-9 object-contain rounded-full"
          />
        </div>
      ) : (
        <div className={cn(
          "p-2 rounded-full",
          "bg-gray-100 text-gray-700",
          "dark:bg-gray-800 dark:text-gray-300"
        )}>
          <Store className="h-4 w-4" />
        </div>
      )}
    </>
  );
}
