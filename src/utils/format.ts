
/**
 * Formate un nombre en devise avec le symbole € et le bon formatage pour la France
 * @param value - Valeur à formater
 * @returns Chaîne formatée avec symbole de devise
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formate un nombre en pourcentage avec le symbole %
 * @param value - Valeur à formater (ex: 0.15 pour 15%)
 * @returns Chaîne formatée avec symbole de pourcentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
};

/**
 * Formate une date au format localisé français
 * @param date - Date à formater
 * @returns Chaîne de date formatée
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};
