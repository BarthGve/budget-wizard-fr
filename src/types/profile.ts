
export type ProfileType = 'basic' | 'pro';

export interface DashboardPreferences {
  show_revenue_card?: boolean;
  show_expenses_card?: boolean;
  show_credits_card?: boolean;
  show_savings_card?: boolean;
  show_expense_stats?: boolean;
  show_charts?: boolean;
  show_contributors?: boolean;
  show_savings_projects_card?: boolean;
}

export interface HSLColorPalette {
  hue: number;
  saturation: number;
  lightness: number;
}

export interface ColorPalette {
  light: {
    tertiary: HSLColorPalette;
    quaternary: HSLColorPalette;
    quinary: HSLColorPalette;
    senary: HSLColorPalette;
  };
  dark: {
    tertiary: HSLColorPalette;
    quaternary: HSLColorPalette;
    quinary: HSLColorPalette;
    senary: HSLColorPalette;
  };
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  color_palette: ColorPalette | null | string; // Permettre à la fois string et ColorPalette pour la compatibilité
  savings_goal_percentage: number | null;
  updated_at: string | null;
  email?: string | null;
  profile_type: ProfileType;
  encryption_enabled: boolean | null;
  notif_inscriptions?: boolean;
  notif_changelog?: boolean;
  notif_feedbacks?: boolean;
  notif_credits?: boolean;
  onboarding_completed?: boolean;
  dashboard_preferences?: DashboardPreferences | null;
}

// Fonction utilitaire pour parser le color_palette si c'est une chaîne
export function parseColorPalette(colorPalette: string | ColorPalette | null): ColorPalette | null {
  if (!colorPalette) return null;
  
  if (typeof colorPalette === 'string') {
    try {
      return JSON.parse(colorPalette) as ColorPalette;
    } catch (e) {
      console.error("Erreur lors du parsing de la palette de couleurs:", e);
      return null;
    }
  }
  
  return colorPalette;
}
