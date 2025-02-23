export const calculateTotalRevenue = (contributors: any[] | null) => {
  return contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
};

export const calculateMonthlyExpenses = (recurringExpenses: any[] | null) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  return recurringExpenses?.reduce((sum, expense) => {
    switch (expense.periodicity) {
      case "monthly":
        return sum + expense.amount;
      case "quarterly":
        return sum + (expense.debit_month === currentMonth ? expense.amount : 0);
      case "yearly":
        return sum + (expense.debit_month === currentMonth ? expense.amount : 0);
      default:
        return sum;
    }
  }, 0) || 0;
};

export const calculateYearlyExpenses = (recurringExpenses: any[] | null) => {
  if (!recurringExpenses) return 0;

  const monthlyTotal = recurringExpenses
    .filter(expense => expense.periodicity === "monthly")
    .reduce((sum, expense) => sum + expense.amount * 12, 0);

  const quarterlyTotal = recurringExpenses
    .filter(expense => expense.periodicity === "quarterly")
    .reduce((sum, expense) => sum + expense.amount * 4, 0);

  const yearlyTotal = recurringExpenses
    .filter(expense => expense.periodicity === "yearly")
    .reduce((sum, expense) => sum + expense.amount, 0);

  return monthlyTotal + quarterlyTotal + yearlyTotal;
};

export const calculateTotalSavings = (monthlySavings: any[] | null) => {
  return monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
};

export const getCumulativeContributionPercentages = (contributors: any[] | null, total: number) => {
  return contributors?.reduce<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }[]>((acc, contributor) => {
    const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
    const percentage = contributor.total_contribution / total * 100;
    return [...acc, {
      name: contributor.name,
      start: lastEnd,
      end: lastEnd + percentage,
      amount: contributor.total_contribution
    }];
  }, []) || [];
};

export const getCumulativeExpensePercentages = (contributors: any[] | null, expenses: number) => {
  return contributors?.reduce<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }[]>((acc, contributor) => {
    const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
    const contributorShare = expenses * (contributor.percentage_contribution / 100);
    return [...acc, {
      name: contributor.name,
      start: lastEnd,
      end: lastEnd + contributor.percentage_contribution,
      amount: contributorShare
    }];
  }, []) || [];
};

export const calculateGlobalBalance = (
  totalRevenue: number,
  recurringExpenses: any[] | null,
  monthlySavings: any[] | null,
  credits: any[] | null
) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate total expenses
  const totalExpenses = calculateMonthlyExpenses(recurringExpenses);

  // Calculate total savings
  const totalSavings = calculateTotalSavings(monthlySavings);

  // Calculate total credits (active + repaid this month)
  const totalCredits = credits?.reduce((sum, credit) => {
    if (credit.statut === 'actif') {
      return sum + credit.montant_mensualite;
    }
    // Include repaid credits if they were repaid this month
    if (credit.statut === 'remboursé') {
      const repaymentDate = new Date(credit.date_derniere_mensualite);
      if (repaymentDate >= firstDayOfMonth) {
        return sum + credit.montant_mensualite;
      }
    }
    return sum;
  }, 0) || 0;

  return totalRevenue - totalExpenses - totalSavings - totalCredits;
};
