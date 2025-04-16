
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, RotateCcw, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useColorPalette, HSLColor } from "@/hooks/useColorPalette";
import { ColorPicker } from "./ColorPicker";
import { ColorPreview } from "./ColorPreview";

// Étiquettes pour les couleurs
const colorLabels = {
  tertiary: "Dépenses",
  quaternary: "Épargne",
  quinary: "Revenus",
  senary: "Crédits"
};

export const ColorPaletteSettings = () => {
  const isMobile = useIsMobile();
  const {
    colorPalette,
    isLoading,
    isSaving,
    hasChanges,
    loadColorPalette,
    updateColor,
    saveColorPalette,
    resetToDefaults,
    getHexColor,
    rgbToHsl
  } = useColorPalette();

  // Charger les couleurs au montage du composant
  useEffect(() => {
    loadColorPalette();
  }, []);

  // Gérer le changement de couleur
  const handleColorChange = (
    colorType: keyof typeof colorLabels,
    mode: "light" | "dark",
    hsl: HSLColor
  ) => {
    updateColor(colorType, mode, hsl);
  };

  return (
    <Card className={isMobile ? "shadow-sm border-0" : ""}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <CardTitle className={isMobile ? "text-xl" : ""}>Palette de couleurs</CardTitle>
        </div>
        <CardDescription>
          Personnalisez les couleurs de l'application pour chaque catégorie
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Chargement des préférences de couleurs...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="light">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="light" className="flex-1">Mode clair</TabsTrigger>
                <TabsTrigger value="dark" className="flex-1">Mode sombre (auto)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="light" className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(colorLabels).map(([key, label]) => (
                    <ColorPicker
                      key={key}
                      label={label}
                      description={`Couleur pour la catégorie ${label}`}
                      hexColor={getHexColor(key as keyof typeof colorLabels, "light")}
                      onColorChange={(hsl) => handleColorChange(key as keyof typeof colorLabels, "light", hsl)}
                      rgbToHsl={rgbToHsl}
                    />
                  ))}
                </div>
                
                <Separator />
                
                <ColorPreview 
                  colorNames={colorLabels} 
                  currentMode="light" 
                />
              </TabsContent>
              
              <TabsContent value="dark" className="space-y-6">
                <div className="p-4 mb-2 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Les couleurs du mode sombre sont automatiquement générées à partir des couleurs du mode clair pour une meilleure cohérence visuelle.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(colorLabels).map(([key, label]) => (
                    <ColorPicker
                      key={key}
                      label={label}
                      description={`Couleur pour la catégorie ${label} (mode sombre)`}
                      hexColor={getHexColor(key as keyof typeof colorLabels, "dark")}
                      onColorChange={(hsl) => handleColorChange(key as keyof typeof colorLabels, "dark", hsl)}
                      rgbToHsl={rgbToHsl}
                      disabled={true}
                    />
                  ))}
                </div>
                
                <Separator />
                
                <ColorPreview 
                  colorNames={colorLabels} 
                  currentMode="dark" 
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                disabled={isSaving}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
              
              <Button
                onClick={saveColorPalette}
                disabled={isSaving || !hasChanges}
                size="sm"
              >
                {isSaving ? (
                  "Enregistrement..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
