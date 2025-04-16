
import { HSLColor } from './types';

// Convertir une couleur claire en couleur sombre
export const deriveDarkColor = (lightColor: HSLColor): HSLColor => {
  // Conserver la teinte (hue)
  const darkHue = lightColor.hue;
  
  // Ajuster la saturation (généralement augmente en mode sombre pour plus de vivacité)
  // Limiter entre 0 et 100
  const darkSaturation = Math.min(100, Math.max(0, lightColor.saturation + 5));
  
  // Ajuster la luminosité (réduire pour les couleurs normales, augmenter pour les couleurs très foncées)
  let darkLightness;
  if (lightColor.lightness > 60) {
    // Pour les couleurs claires, réduire significativement la luminosité
    darkLightness = Math.max(20, lightColor.lightness - 30);
  } else if (lightColor.lightness < 30) {
    // Pour les couleurs déjà sombres, augmenter légèrement la luminosité
    darkLightness = Math.min(45, lightColor.lightness + 15);
  } else {
    // Pour les couleurs moyennes, réduire modérément
    darkLightness = Math.max(25, lightColor.lightness - 20);
  }
  
  return {
    hue: darkHue,
    saturation: darkSaturation,
    lightness: darkLightness
  };
};
