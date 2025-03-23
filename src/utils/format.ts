
// Fonction pour formater un montant en devise
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

// Fonction pour formater un volume en litres avec 2 décimales
export const formatVolume = (volume: number): string => {
  return `${volume.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
};

// Fonction pour formater un prix au litre
export const formatPricePerLiter = (price: number): string => {
  return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} €/L`;
};
