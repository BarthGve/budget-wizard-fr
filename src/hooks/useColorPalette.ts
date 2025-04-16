
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { parseColorPalette } from "@/types/profile";

// Types pour les couleurs HSL
export interface HSLColor {
  hue: number;
  saturation: number;
  lightness: number;
}

// Interface pour le profil de couleurs (mode clair et sombre)
export interface ColorPaletteProfile {
  light: {
    tertiary: HSLColor;
    quaternary: HSLColor;
    quinary: HSLColor;
    senary: HSLColor;
  };
  dark: {
    tertiary: HSLColor;
    quaternary: HSLColor;
    quinary: HSLColor;
    senary: HSLColor;
  };
}

// Les valeurs par défaut pour les couleurs (extraites du fichier base.css)
const defaultColors: ColorPaletteProfile = {
  light: {
    tertiary: { hue: 234, saturation: 85, lightness: 50 },
    quaternary: { hue: 196, saturation: 62, lightness: 46 },
    quinary: { hue: 162, saturation: 72, lightness: 42 },
    senary: { hue: 42, saturation: 87, lightness: 55 }
  },
  dark: {
    tertiary: { hue: 234, saturation: 75, lightness: 70 },
    quaternary: { hue: 196, saturation: 100, lightness: 28 },
    quinary: { hue: 162, saturation: 72, lightness: 22 },
    senary: { hue: 42, saturation: 87, lightness: 35 }
  }
};

export function useColorPalette() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // État pour les couleurs personnalisées
  const [colorPalette, setColorPalette] = useState<ColorPaletteProfile>(defaultColors);
  const [savedColorPalette, setSavedColorPalette] = useState<ColorPaletteProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les couleurs depuis le profil utilisateur
  const loadColorPalette = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("color_palette")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      
      if (data?.color_palette) {
        // Analyser la chaîne JSON si nécessaire
        const parsedPalette = parseColorPalette(data.color_palette);
        
        if (parsedPalette) {
          setColorPalette(parsedPalette);
          setSavedColorPalette(parsedPalette);
          
          // Appliquer les couleurs immédiatement
          applyColorPalette(parsedPalette);
        } else {
          // Si le parsing échoue, utiliser les valeurs par défaut
          resetToDefaults();
        }
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
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si des modifications ont été apportées
  useEffect(() => {
    if (!savedColorPalette) return;

    setHasChanges(JSON.stringify(colorPalette) !== JSON.stringify(savedColorPalette));
  }, [colorPalette, savedColorPalette]);

  // Appliquer les couleurs aux variables CSS
  const applyColorPalette = (palette: ColorPaletteProfile) => {
    const root = document.documentElement;
    const currentMode = isDarkMode ? "dark" : "light";
    const colors = palette[currentMode];

    // Appliquer les couleurs tertiaires
    root.style.setProperty("--tertiary-hue", colors.tertiary.hue.toString());
    root.style.setProperty("--tertiary-saturation", `${colors.tertiary.saturation}%`);
    root.style.setProperty("--tertiary-lightness", `${colors.tertiary.lightness}%`);
    
    // Appliquer les couleurs quaternaires
    root.style.setProperty("--quaternary-hue", colors.quaternary.hue.toString());
    root.style.setProperty("--quaternary-saturation", `${colors.quaternary.saturation}%`);
    root.style.setProperty("--quaternary-lightness", `${colors.quaternary.lightness}%`);
    
    // Appliquer les couleurs quinaires
    root.style.setProperty("--quinary-hue", colors.quinary.hue.toString());
    root.style.setProperty("--quinary-saturation", `${colors.quinary.saturation}%`);
    root.style.setProperty("--quinary-lightness", `${colors.quinary.lightness}%`);
    
    // Appliquer les couleurs senaires
    root.style.setProperty("--senary-hue", colors.senary.hue.toString());
    root.style.setProperty("--senary-saturation", `${colors.senary.saturation}%`);
    root.style.setProperty("--senary-lightness", `${colors.senary.lightness}%`);
    
    // Forcer le rafraîchissement du rendu
    document.documentElement.classList.add('theme-updated');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-updated');
    }, 100);
  };

  // Mettre à jour une couleur spécifique
  const updateColor = (colorType: keyof ColorPaletteProfile["light"], mode: "light" | "dark", hsl: HSLColor) => {
    setColorPalette(prev => {
      const newPalette = {
        ...prev,
        [mode]: {
          ...prev[mode],
          [colorType]: hsl
        }
      };
      
      // Appliquer les changements immédiatement si dans le bon mode
      if ((isDarkMode && mode === "dark") || (!isDarkMode && mode === "light")) {
        applyColorPalette(newPalette);
      }
      
      return newPalette;
    });
  };

  // Conversion HSL vers RGB
  const hslToRgb = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    
    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Conversion RGB vers HSL
  const rgbToHsl = (hexColor: string): HSLColor => {
    // Enlever le # si présent
    hexColor = hexColor.replace('#', '');
    
    // Convertir hex en RGB
    const r = parseInt(hexColor.substring(0, 2), 16) / 255;
    const g = parseInt(hexColor.substring(2, 4), 16) / 255;
    const b = parseInt(hexColor.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return { hue: h, saturation: s, lightness: l };
  };

  // Enregistrer les couleurs personnalisées
  const saveColorPalette = async () => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      
      // Convertir l'objet colorPalette en JSON pour stockage
      const { error } = await supabase
        .from("profiles")
        .update({ 
          color_palette: JSON.stringify(colorPalette),
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Mettre à jour l'état sauvegardé
      setSavedColorPalette(colorPalette);
      setHasChanges(false);
      
      toast({
        title: "Palette de couleurs enregistrée",
        description: "Vos préférences de couleurs ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la palette de couleurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences de couleurs",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Réinitialiser aux valeurs par défaut
  const resetToDefaults = () => {
    setColorPalette(defaultColors);
    applyColorPalette(defaultColors);
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
    applyColorPalette
  };
}
