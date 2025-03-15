
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormData, SavingsMode } from "../types";
import { Image as ImageIcon } from "lucide-react";

interface StepThreeProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepThree = ({ data, onChange }: StepThreeProps) => {
  const [imageUrl, setImageUrl] = useState<string>(data.image_url || "");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(data.image_url || "");

  const handleUrlChange = (newUrl: string) => {
    setImageUrl(newUrl);
    onChange("image_url", newUrl);
    
    // Mettre à jour la prévisualisation seulement si l'URL est valide
    if (newUrl && (newUrl.startsWith("http://") || newUrl.startsWith("https://"))) {
      setImagePreviewUrl(newUrl);
    } else {
      setImagePreviewUrl("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image_url" className="text-gray-700 dark:text-gray-300">
          URL de l'image (optionnel)
        </Label>
        <Input
          id="image_url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          className={cn(
            "border-gray-300 focus:border-green-500 focus:ring-green-500", 
            "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
          )}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Ajoutez une image représentative pour votre projet
        </p>
      </div>

      {/* Prévisualisation de l'image */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prévisualisation</p>
        
        <div className={cn(
          "border-2 border-dashed rounded-lg h-48 flex items-center justify-center overflow-hidden",
          "bg-gray-50 dark:bg-gray-800",
          imagePreviewUrl ? "border-green-300 dark:border-green-600" : "border-gray-300 dark:border-gray-600"
        )}>
          {imagePreviewUrl ? (
            <img 
              src={imagePreviewUrl} 
              alt="Prévisualisation" 
              className="object-cover w-full h-full" 
              onError={() => setImagePreviewUrl("")}
            />
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                L'image apparaîtra ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
