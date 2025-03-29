
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BrandLogoPreview } from "../BrandLogoPreview";
import { StatusBadge } from "./StatusBadge";

type VehicleCardHeaderProps = {
  brand: string;
  model?: string;
  status: string;
  previewLogoUrl: string | null;
  isLogoValid: boolean;
  hasPhoto: boolean;
};

export const VehicleCardHeader = ({ 
  brand, 
  model, 
  status, 
  previewLogoUrl, 
  isLogoValid, 
  hasPhoto 
}: VehicleCardHeaderProps) => {
  return (
    <CardHeader className={cn(
      "pb-3 pt-4 relative",
      hasPhoto ? "pt-0 -mt-10 z-10" : "",
    )}>
      <div className={cn(
        "flex items-center gap-3",
        hasPhoto && "text-white"
      )}>
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full overflow-hidden",
          hasPhoto && "border-2 border-white shadow-md"
        )}>
          <BrandLogoPreview 
            url={previewLogoUrl}
            isValid={isLogoValid}
            isChecking={false}
            brand={brand}
          />
        </div>
        <CardTitle className={cn(
          "text-xl font-bold",
          hasPhoto 
            ? "text-white drop-shadow-md" 
            : "text-gray-800 dark:text-gray-100"
        )}>
          {model || brand}
        </CardTitle>
      </div>
      
      {!hasPhoto && (
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      )}
    </CardHeader>
  );
};
