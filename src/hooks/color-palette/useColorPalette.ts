
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { ColorPaletteProfile, HSLColor, defaultColors } from './types';
import { hslToRgb, rgbToHsl } from './colorConversion';
import { deriveDarkColor } from './colorDerivation';
import { applyColorPalette, loadUserColorPalette, saveUserColorPalette } from './paletteStorage';
import { useAuthContext } from "@/context/AuthProvider";

export function useColorPalette() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Accéder directement au contexte d'authentification pour éviter les dépendances circulaires
  const { isAuthenticated, user } = useAuthContext();
  
  // État pour les couleurs personnalisées
  const [colorPalette, setColorPalette] = useState<ColorPaletteProfile>(defaultColors);
  // Initialiser savedColorPalette avec defaultColors pour éviter la comparaison avec null
  const [savedColorPalette, setSavedColorPalette] = useState<ColorPaletteProfile>(defaultColors);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string | null>(null);

  // Charger les couleurs via une fonction optimisée avec useCallback
  const loadColorPalette = useCallback(async () => {
    // Éviter les chargements répétés pour le même utilisateur
    if (isLoading) return;
    if (user?.id && lastLoadedUserId === user.id) return;
    
    try {
      setIsLoading(true);
      console.log("Chargement de la palette de couleurs...");
      
      // Si l'utilisateur n'est pas authentifié, utiliser les valeurs par défaut
      if (!isAuthenticated || !user) {
        console.log("Aucun utilisateur authentifié, utilisation des couleurs par défaut");
        resetToDefaults();
        setIsLoading(false);
        return;
      }
      
      // Mettre à jour l'ID de l'utilisateur chargé
      setLastLoadedUserId(user.id);
      
      const loadedPalette = await loadUserColorPalette();
      
      if (loadedPalette) {
        console.log("Palette de couleurs chargée avec succès");
        setColorPalette(loadedPalette);
        setSavedColorPalette(loadedPalette);
        
        // Appliquer les couleurs immédiatement
        applyColorPalette(loadedPalette, isDarkMode);
      } else {
        // Si aucune palette n'existe, utiliser les valeurs par défaut
        console.log("Aucune palette trouvée, utilisation des couleurs par défaut");
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
  }, [isAuthenticated, user?.id, isDarkMode, toast]);

  // Recharger la palette à chaque changement d'utilisateur avec dépendances optimisées
  useEffect(() => {
    if (user?.id) {
      console.log("ID utilisateur changé, rechargement des couleurs");
      loadColorPalette();
    } else if (!isAuthenticated && lastLoadedUserId) {
      // Réinitialiser si l'utilisateur se déconnecte
      console.log("Déconnexion détectée, réinitialisation des couleurs");
      setLastLoadedUserId(null);
      resetToDefaults();
    }
  }, [user?.id, isAuthenticated, loadColorPalette]);

  // Appliquer les couleurs à chaque changement de thème
  useEffect(() => {
    // Appliquer les couleurs actuelles quand le thème change
    console.log("Thème changé, application des couleurs");
    applyColorPalette(colorPalette, isDarkMode);
  }, [isDarkMode, colorPalette]);

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
  const resetToDefaults = useCallback(() => {
    setColorPalette(defaultColors);
    // Important: Mettre à jour aussi l'état sauvegardé pour que hasChanges soit false après reset
    setSavedColorPalette({...defaultColors});
    applyColorPalette(defaultColors, isDarkMode);
  }, [isDarkMode]);

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
