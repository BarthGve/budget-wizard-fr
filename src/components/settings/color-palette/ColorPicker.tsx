
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HSLColor } from "@/hooks/useColorPalette";

interface ColorPickerProps {
  label: string;
  description?: string;
  hexColor: string;
  onColorChange: (hsl: HSLColor) => void;
  rgbToHsl: (hex: string) => HSLColor;
  disabled?: boolean;
}

export const ColorPicker = ({
  label,
  description,
  hexColor,
  onColorChange,
  rgbToHsl,
  disabled = false
}: ColorPickerProps) => {
  const [localHexColor, setLocalHexColor] = useState(hexColor);

  // Gère la modification de la couleur via le color picker
  const handleColorChange = (newColor: string) => {
    setLocalHexColor(newColor);
    const hslColor = rgbToHsl(newColor);
    onColorChange(hslColor);
  };

  // Gère la modification de la couleur via l'input hex
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    
    // Valider le format hexadécimal
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      handleColorChange(newColor);
    } else {
      setLocalHexColor(newColor);
    }
  };

  // Sur la perte de focus, vérifier si la couleur est valide
  const handleBlur = () => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(localHexColor)) {
      setLocalHexColor(hexColor);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`color-${label}`}>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild disabled={disabled}>
            <button
              className={cn(
                "h-10 w-10 rounded-md border border-input flex items-center justify-center",
                disabled && "opacity-60 cursor-not-allowed"
              )}
              style={{ backgroundColor: hexColor }}
              aria-label={`Choisir une couleur pour ${label}`}
              disabled={disabled}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <HexColorPicker color={localHexColor} onChange={handleColorChange} />
          </PopoverContent>
        </Popover>
        
        <Input
          id={`color-${label}`}
          value={localHexColor}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-28 font-mono uppercase"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
