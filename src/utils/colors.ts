
const palettes = {
  default: [
    'rgb(59, 130, 246)', // blue-500
    'rgb(34, 197, 94)', // green-500
    'rgb(234, 179, 8)', // yellow-500
    'rgb(239, 68, 68)', // red-500
    'rgb(168, 85, 247)', // purple-500
    'rgb(236, 72, 153)', // pink-500
    'rgb(107, 114, 128)', // gray-500
  ],
  ocean: [
    'rgb(14, 165, 233)', // sky-500
    'rgb(6, 182, 212)', // cyan-500
    'rgb(20, 184, 166)', // teal-500
    'rgb(59, 130, 246)', // blue-500
    'rgb(99, 102, 241)', // indigo-500
    'rgb(168, 85, 247)', // purple-500
    'rgb(147, 197, 253)', // blue-300
  ],
  forest: [
    'rgb(34, 197, 94)', // green-500
    'rgb(16, 185, 129)', // emerald-500
    'rgb(168, 162, 158)', // warm-gray-400
    'rgb(234, 179, 8)', // yellow-500
    'rgb(245, 158, 11)', // amber-500
    'rgb(249, 115, 22)', // orange-500
    'rgb(139, 69, 19)', // saddle-brown
  ],
  sunset: [
    'rgb(249, 115, 22)', // orange-500
    'rgb(239, 68, 68)', // red-500
    'rgb(236, 72, 153)', // pink-500
    'rgb(217, 70, 239)', // fuchsia-500
    'rgb(245, 158, 11)', // amber-500
    'rgb(234, 179, 8)', // yellow-500
    'rgb(168, 85, 247)', // purple-500
  ],
  candy: [
    'rgb(244, 114, 182)', // pink-400
    'rgb(248, 113, 113)', // red-400
    'rgb(251, 146, 60)', // orange-400
    'rgb(250, 204, 21)', // yellow-400
    'rgb(74, 222, 128)', // green-400
    'rgb(96, 165, 250)', // blue-400
    'rgb(192, 132, 252)', // purple-400
  ],
};

export const getCategoryColor = (index: number, palette: string = 'default'): string => {
  const selectedPalette = palettes[palette as keyof typeof palettes] || palettes.default;
  return selectedPalette[index % selectedPalette.length];
};
