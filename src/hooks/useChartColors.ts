
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

// Type pour définir les variantes de couleurs
type ColorVariants = {
  base: string;       // Couleur de base
  lighter: string[];  // Dégradés plus clairs
  darker: string[];   // Dégradés plus foncés
  all: string[];      // Toutes les couleurs combinées
};

/**
 * Hook qui génère des palettes de couleurs basées sur les variables CSS
 * @param colorType - Le type de couleur à utiliser ('primary', 'tertiary', 'quaternary', 'senary', 'quinary')
 * @param shades - Nombre de nuances à générer dans chaque direction
 * @returns Un objet contenant les variantes de couleurs
 */
export const useChartColors = (
  colorType: "primary" | "tertiary" | "quaternary" | "senary" | "quinary",
  shades: number = 3
): ColorVariants => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Récupérer les couleurs depuis les variables CSS
  const getColorFromCSSVar = (variable: string): string => {
    // Récupérer la valeur de la variable CSS
    const cssVar = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${variable}`)
      .trim();
    
    // Si la variable n'est pas définie, retourner une couleur par défaut
    if (!cssVar) {
      console.warn(`Variable CSS --${variable} non définie`);
      return colorType === "primary" 
        ? "#9b87f5" 
        : colorType === "tertiary" 
          ? "#ef4444" 
          : colorType === "senary"
            ? "#f59e0b" // Couleur par défaut pour senary (orange ambre)
            : colorType === "quinary"
              ? "#10b981" // Couleur par défaut pour quinary (vert émeraude)
              : "#0ea5e9";
    }
    
    return `hsl(${cssVar})`;
  };
  
  // Générer les variantes de couleurs
  const colorVariants = useMemo(() => {
    // Récupérer la couleur de base
    const baseColor = getColorFromCSSVar(colorType);
    
    // Générer des variantes plus claires pour le mode clair
    const generateLighterShades = () => {
      const shadeNumbers = Array.from({ length: shades }, (_, i) => (i + 1) * 100);
      return shadeNumbers.map(num => getColorFromCSSVar(`${colorType}-${num}`));
    };
    
    // Générer des variantes plus sombres pour le mode sombre
    const generateDarkerShades = () => {
      const shadeNumbers = Array.from({ length: shades }, (_, i) => (i + 6) * 100);
      return shadeNumbers.map(num => getColorFromCSSVar(`${colorType}-${num}`));
    };
    
    // Adapter les nuances en fonction du mode
    const lighter = isDarkMode 
      ? [getColorFromCSSVar(`${colorType}-200`), getColorFromCSSVar(`${colorType}-300`), getColorFromCSSVar(`${colorType}-400`)]
      : generateLighterShades();
      
    const darker = isDarkMode
      ? generateDarkerShades()
      : [getColorFromCSSVar(`${colorType}-600`), getColorFromCSSVar(`${colorType}-700`), getColorFromCSSVar(`${colorType}-800`)];
    
    // Combiner toutes les couleurs
    const all = [
      ...lighter,
      baseColor,
      ...darker
    ];
    
    return {
      base: baseColor,
      lighter,
      darker,
      all
    };
  }, [colorType, isDarkMode, shades]);

  return colorVariants;
};
