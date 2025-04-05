
import { DashboardPreferences } from "@/types/profile";

/**
 * Vérifie si un objet est conforme au type DashboardPreferences
 * 
 * @param obj Objet à vérifier
 * @returns Boolean indiquant si l'objet est un DashboardPreferences valide
 */
export const isDashboardPreferences = (obj: any): obj is DashboardPreferences => {
  return obj !== null && 
         typeof obj === 'object' &&
         obj !== undefined;
};

/**
 * Préférences par défaut pour le tableau de bord
 */
export const defaultDashboardPreferences: DashboardPreferences = {
  show_revenue_card: true,
  show_expenses_card: true,
  show_credits_card: true,
  show_savings_card: true,
  show_expense_stats: true,
  show_charts: true,
  show_contributors: true
};

/**
 * Fusionne les préférences utilisateur avec les préférences par défaut
 * Cette fonction convertit explicitement Json en DashboardPreferences
 * 
 * @param userPrefs Préférences définies par l'utilisateur (peut être de n'importe quel type)
 * @returns Préférences fusionnées de type DashboardPreferences
 */
export const mergeDashboardPreferences = (
  userPrefs: any
): DashboardPreferences => {
  try {
    // Vérification renforcée que userPrefs est un objet valide
    if (userPrefs && typeof userPrefs === 'object') {
      // Utiliser Object.assign pour fusionner les objets
      return Object.assign({}, defaultDashboardPreferences, userPrefs);
    } else if (typeof userPrefs === 'string') {
      // Tenter de parser si c'est une chaîne JSON
      try {
        const parsed = JSON.parse(userPrefs);
        if (parsed && typeof parsed === 'object') {
          return Object.assign({}, defaultDashboardPreferences, parsed);
        }
      } catch (parseError) {
        console.error("Erreur lors du parsing des préférences JSON:", parseError);
      }
    }
    
    // Si aucune conversion n'a fonctionné, retourner les préférences par défaut
    console.log("Utilisation des préférences par défaut pour le tableau de bord");
    return defaultDashboardPreferences;
  } catch (error) {
    console.error("Erreur lors de la fusion des préférences:", error);
    return defaultDashboardPreferences;
  }
};
