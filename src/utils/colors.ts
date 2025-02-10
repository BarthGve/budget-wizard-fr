
export const getCategoryColor = (index: number): string => {
  const colors = [
    'rgb(59, 130, 246)', // blue-500
    'rgb(34, 197, 94)', // green-500
    'rgb(234, 179, 8)', // yellow-500
    'rgb(239, 68, 68)', // red-500
    'rgb(168, 85, 247)', // purple-500
    'rgb(236, 72, 153)', // pink-500
    'rgb(107, 114, 128)', // gray-500
  ];
  return colors[index % colors.length];
};
