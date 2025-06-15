import axios from 'axios';

interface FinancialMetrics {
  monthlyIncome: number;
  totalExpenses: number;
  remainingBudget: number;
  expensesByCategory: Record<string, number>;
}

// Using a simpler rule-based system instead of external API
export async function getFinancialAdvice(metrics: FinancialMetrics): Promise<string> {
  const { monthlyIncome, totalExpenses, remainingBudget, expensesByCategory } = metrics;
  const savingsRate = (remainingBudget / monthlyIncome) * 100;
  const expenseRate = (totalExpenses / monthlyIncome) * 100;

  // Get top expense categories
  const topExpenses = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  // Generate specific advice based on financial metrics
  if (savingsRate < 20) {
    const topCategory = topExpenses[0];
    if (topCategory) {
      return `Your ${topCategory[0].toLowerCase()} expenses are high at ₹${topCategory[1]}. Try to reduce this by 20% to improve your savings rate.`;
    }
    return 'Aim to save at least 20% of your income. Consider reducing non-essential expenses.';
  }

  if (expenseRate > 80) {
    return 'Your expenses are over 80% of your income. Consider creating a stricter budget to build an emergency fund.';
  }

  if (savingsRate > 30) {
    return 'Great savings rate! Consider investing your surplus in mutual funds or fixed deposits for better returns.';
  }

  // Check for specific category-based advice
  const hasHighFood = expensesByCategory['Food'] > monthlyIncome * 0.3;
  if (hasHighFood) {
    return 'Your food expenses are high. Consider meal planning and cooking at home to reduce costs.';
  }

  const hasHighEntertainment = expensesByCategory['Entertainment'] > monthlyIncome * 0.15;
  if (hasHighEntertainment) {
    return 'Entertainment expenses are significant. Look for free or low-cost entertainment options.';
  }

  // Default balanced advice
  return 'Maintain your current budget and consider investing any extra savings for long-term growth.';
}