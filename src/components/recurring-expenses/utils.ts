
export const formatDebitDate = (debit_day: number, debit_month: number | null, periodicity: string) => {
  const day = debit_day.toString().padStart(2, '0');
  
  if (periodicity === "monthly") {
    return `Le ${day} de chaque mois`;
  } else {
    const monthName = new Date(0, debit_month! - 1).toLocaleString('fr-FR', { month: 'long' });
    return `Le ${day} ${monthName}`;
  }
};
