
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
export const defaultColors: ColorPaletteProfile = {
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
