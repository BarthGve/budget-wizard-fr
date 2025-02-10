
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppearanceSettingsProps {
  colorPalette: string;
  onColorPaletteChange: (value: string) => void;
}

export const AppearanceSettings = ({ colorPalette, onColorPaletteChange }: AppearanceSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <CardTitle>Apparence</CardTitle>
        </div>
        <CardDescription>Personnalisez l'apparence de votre espace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Palette de couleurs</Label>
          <Select defaultValue={colorPalette || "default"} onValueChange={onColorPaletteChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une palette" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Par défaut</SelectItem>
              <SelectItem value="ocean">Océan</SelectItem>
              <SelectItem value="forest">Forêt</SelectItem>
              <SelectItem value="sunset">Coucher de soleil</SelectItem>
              <SelectItem value="candy">Bonbons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
