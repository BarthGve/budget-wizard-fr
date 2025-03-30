
import { DashboardPreferences } from "@/types/profile";

// Valeurs par défaut pour les préférences de tableau de bord
export const defaultPreferencesValues: DashboardPreferences = {
  show_revenue_card: true,
  show_expenses_card: true,
  show_credits_card: true,
  show_savings_card: true,
  show_expense_stats: true,
  show_charts: true,
  show_contributors: true
};

// Fonction utilitaire pour vérifier si un objet est du type DashboardPreferences
export const isDashboardPreferences = (obj: any): obj is DashboardPreferences => {
  return obj !== null && 
         typeof obj === 'object' &&
         obj !== undefined;
};

// Fonction pour initialiser les états avec des valeurs de profil ou des valeurs par défaut
export const getInitialPreferenceState = (
  preferences: any,
  propertyKey: keyof DashboardPreferences
): boolean => {
  try {
    if (isDashboardPreferences(preferences)) {
      return preferences[propertyKey] !== false;
    }
    return defaultPreferencesValues[propertyKey] !== false;
  } catch (error) {
    console.error(`Erreur lors de l'accès à la préférence ${String(propertyKey)}:`, error);
    return true; // Par défaut visible
  }
};

// Fonction pour créer un objet de préférences mis à jour
export const createUpdatedPreferences = (
  currentPreferences: any,
  key: keyof DashboardPreferences,
  value: boolean
): DashboardPreferences => {
  return {
    ...defaultPreferencesValues,
    ...(isDashboardPreferences(currentPreferences) ? currentPreferences : {}),
    [key]: value
  };
};
