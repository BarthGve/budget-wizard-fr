
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HSLColor } from "@/hooks/useColorPalette";

interface ColorPickerProps {
  label: string;
  description?: string;
  hexColor: string;
  onColorChange: (hsl: HSLColor) => void;
  rgbToHsl: (hex: string) => HSLColor;
}

export const ColorPicker = ({
  label,
  description,
  hexColor,
  onColorChange,
  rgbToHsl
}: ColorPickerProps) => {
  const [color, setColor] = useState(hexColor);
  
  // Mettre à jour la couleur locale lorsque la prop change
  useEffect(() => {
    setColor(hexColor);
  }, [hexColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onColorChange(rgbToHsl(newColor));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor={`color-${label}`} className="font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full border",
              "border-input shadow-sm"
            )}
            style={{ backgroundColor: color }}
          />
          <Input
            id={`color-${label}`}
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-12 h-8 p-0 overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};
