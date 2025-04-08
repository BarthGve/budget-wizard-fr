
/**
 * Formate un nombre en devise
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formate un nombre en pourcentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value / 100);
};
