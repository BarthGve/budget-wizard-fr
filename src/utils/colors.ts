
const palettes = {
  default: [
    '#9b87f5', // Primary Purple
    '#7E69AB', // Secondary Purple
    '#8B5CF6', // Vivid Purple
    '#D946EF', // Magenta Pink
    '#F97316', // Bright Orange
    '#0EA5E9', // Ocean Blue
    '#8E9196', // Neutral Gray
  ],
  ocean: [
    '#0EA5E9', // sky-500
    '#06B6D4', // cyan-500
    '#14B8A6', // teal-500
    '#3B82F6', // blue-500
    '#6366F1', // indigo-500
    '#A855F7', // purple-500
    '#93C5FD', // blue-300
  ],
  forest: [
    '#22C55E', // green-500
    '#10B981', // emerald-500
    '#A8A29E', // warm-gray-400
    '#EAB308', // yellow-500
    '#F59E0B', // amber-500
    '#F97316', // orange-500
    '#8B4513', // saddle-brown
  ],
  sunset: [
    '#F97316', // orange-500
    '#EF4444', // red-500
    '#EC4899', // pink-500
    '#D946EF', // fuchsia-500
    '#F59E0B', // amber-500
    '#EAB308', // yellow-500
    '#A855F7', // purple-500
  ],
  candy: [
    '#F472B6', // pink-400
    '#F87171', // red-400
    '#FB923C', // orange-400
    '#FACC15', // yellow-400
    '#4ADE80', // green-400
    '#60A5FA', // blue-400
    '#C084FC', // purple-400
  ],
};

export const getCategoryColor = (index: number, palette: string = 'default'): string => {
  const selectedPalette = palettes[palette as keyof typeof palettes] || palettes.default;
  return selectedPalette[index % selectedPalette.length];
};
