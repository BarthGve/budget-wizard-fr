
// Define elegant color palettes for light and dark themes
const lightThemeColors = [
  '#9b87f5', // Primary Purple
  '#D6BCFA', // Light Purple
  '#E5DEFF', // Soft Purple
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#D3E4FD', // Soft Blue
];

const darkThemeColors = [
  '#1A1F2C', // Dark Purple
  '#7E69AB', // Secondary Purple
  '#6E59A5', // Tertiary Purple
  '#8B5CF6', // Vivid Purple
  '#0EA5E9', // Ocean Blue
  '#1EAEDB', // Bright Blue
];

/**
 * Generates a consistent color based on the name string and theme
 */
export const getAvatarColor = (name: string, isDarkTheme: boolean = false): { background: string; text: string } => {
  const colors = isDarkTheme ? darkThemeColors : lightThemeColors;
  
  // Generate a consistent index based on the string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  const backgroundColor = colors[index];
  
  // Use white text for dark backgrounds, dark text for light backgrounds
  const textColor = isDarkTheme ? '#FFFFFF' : '#1A1F2C';
  
  return {
    background: backgroundColor,
    text: textColor
  };
};

/**
 * Generates initials from a name string
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
