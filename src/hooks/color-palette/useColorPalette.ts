
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { ColorPaletteProfile, HSLColor, defaultColors } from './types';
import { hslToRgb, rgbToHsl } from './colorConversion';
import { deriveDarkColor } from './colorDerivation';
import { applyColorPalette, loadUserColorPalette, saveUserColorPalette } from './paletteStorage';

export function useColorPalette() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // État pour les couleurs personnalisées
  const [colorPalette, setColorPalette] = useState<ColorPaletteProfile>(defaultColors);
  // Initialiser savedColorPalette avec defaultColors pour éviter la comparaison avec null
  const [savedColorPalette, setSavedColorPalette] = useState<ColorPaletteProfile>(defaultColors);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les couleurs au démarrage
  const loadColorPalette = async () => {
    try {
      setIsLoading(true);
      
      const loadedPalette = await loadUserColorPalette();
      
      if (loadedPalette) {
        setColorPalette(loadedPalette);
        setSavedColorPalette(loadedPalette);
        
        // Appliquer les couleurs immédiatement
        applyColorPalette(loadedPalette, isDarkMode);
      } else {
        // Si aucune palette n'existe, utiliser les valeurs par défaut
        resetToDefaults();
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la palette de couleurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences de couleurs",
        variant: "destructive",
      });
      // En cas d'erreur, initialiser avec les couleurs par défaut
      resetToDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si des modifications ont été apportées
  useEffect(() => {
    // Toujours procéder à la comparaison puisque savedColorPalette est maintenant initialisé
    setHasChanges(JSON.stringify(colorPalette) !== JSON.stringify(savedColorPalette));
  }, [colorPalette, savedColorPalette]);

  // Mettre à jour une couleur spécifique
  const updateColor = (colorType: keyof ColorPaletteProfile["light"], mode: "light" | "dark", hsl: HSLColor) => {
    setColorPalette(prev => {
      // Créer une copie de l'objet de couleurs actuel
      const newPalette = { ...prev };
      
      // Mettre à jour la couleur spécifiée dans le mode demandé
      newPalette[mode] = {
        ...prev[mode],
        [colorType]: hsl
      };
      
      // Si le mode est "light", dériver automatiquement la couleur sombre correspondante
      if (mode === "light") {
        const darkColor = deriveDarkColor(hsl);
        newPalette.dark = {
          ...newPalette.dark,
          [colorType]: darkColor
        };
      }
      
      // Appliquer les changements immédiatement si dans le bon mode
      if ((isDarkMode && mode === "dark") || (!isDarkMode && mode === "light")) {
        applyColorPalette(newPalette, isDarkMode);
      }
      
      return newPalette;
    });
  };

  // Enregistrer les couleurs personnalisées
  const saveColorPalette = async () => {
    if (!hasChanges) return;
    
    try {
      setIsSaving(true);
      
      const success = await saveUserColorPalette(colorPalette, toast);
      
      if (success) {
        // Mettre à jour l'état sauvegardé
        setSavedColorPalette(colorPalette);
        setHasChanges(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Réinitialiser aux valeurs par défaut
  const resetToDefaults = () => {
    setColorPalette(defaultColors);
    // Important: Mettre à jour aussi l'état sauvegardé pour que hasChanges soit false après reset
    // Cela évite que le bouton reste activé après réinitialisation
    setSavedColorPalette({...defaultColors});
    applyColorPalette(defaultColors, isDarkMode);
  };

  // Récupérer la valeur hexadécimale d'une couleur HSL
  const getHexColor = (colorType: keyof ColorPaletteProfile["light"], mode: "light" | "dark"): string => {
    const color = colorPalette[mode][colorType];
    return hslToRgb(color.hue, color.saturation, color.lightness);
  };

  return {
    colorPalette,
    isLoading,
    isSaving,
    hasChanges,
    loadColorPalette,
    updateColor,
    saveColorPalette,
    resetToDefaults,
    getHexColor,
    rgbToHsl,
    hslToRgb,
    applyColorPalette: (palette: ColorPaletteProfile) => applyColorPalette(palette, isDarkMode)
  };
}
