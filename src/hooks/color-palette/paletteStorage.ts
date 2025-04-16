
import { supabase } from "@/integrations/supabase/client";
import { ColorPaletteProfile, defaultColors } from './types';
import { useToast } from "@/hooks/use-toast";

// Appliquer les couleurs aux variables CSS
export const applyColorPalette = (palette: ColorPaletteProfile, isDarkMode: boolean) => {
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

// Charger les couleurs depuis le profil utilisateur
export const loadUserColorPalette = async (): Promise<ColorPaletteProfile | null> => {
  try {
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
      if (typeof data.color_palette === 'string') {
        try {
          return JSON.parse(data.color_palette) as ColorPaletteProfile;
        } catch (e) {
          console.error("Erreur lors du parsing de la palette de couleurs:", e);
          return null;
        }
      } else {
        return data.color_palette as ColorPaletteProfile;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors du chargement de la palette de couleurs:", error);
    return null;
  }
};

// Sauvegarder les couleurs dans le profil utilisateur
export const saveUserColorPalette = async (
  colorPalette: ColorPaletteProfile,
  toast: ReturnType<typeof useToast>["toast"]
): Promise<boolean> => {
  try {
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
    
    toast({
      title: "Palette de couleurs enregistrée",
      description: "Vos préférences de couleurs ont été mises à jour avec succès",
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la palette de couleurs:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'enregistrer vos préférences de couleurs",
      variant: "destructive",
    });
    
    return false;
  }
};
