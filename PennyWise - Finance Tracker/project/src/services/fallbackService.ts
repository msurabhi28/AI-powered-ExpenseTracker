import { format } from 'date-fns';
import { Expense } from '../types/expense';
import { Income } from '../types/income';
import { formatINR } from '../utils/currency';

interface FinancialContext {
  expenses: Expense[];
  monthlyIncome: number;
  additionalIncomes: Income[];
}

export function generateFallbackResponse(
  message: string,
  context: FinancialContext
): string {
  const { expenses, monthlyIncome, additionalIncomes } = context;
  const messageNormalized = message.toLowerCase();

  // Calculate key metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalAdditionalIncome = additionalIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalIncome = monthlyIncome + totalAdditionalIncome;
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  // Handle different types of queries
  if (messageNormalized.includes('savings') || messageNormalized.includes('saving rate')) {
    return `Your current savings rate is ${savingsRate.toFixed(1)}%. You're saving ${formatINR(totalIncome - totalExpenses)} out of your total income of ${formatINR(totalIncome)}.`;
  }

  if (messageNormalized.includes('income') || messageNormalized.includes('earn')) {
    return `Your monthly income is ${formatINR(monthlyIncome)}${
      totalAdditionalIncome > 0 
        ? `, plus additional income of ${formatINR(totalAdditionalIncome)}, totaling ${formatINR(totalIncome)}`
        : ''
    }.`;
  }

  if (messageNormalized.includes('expense') || messageNormalized.includes('spent')) {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return `Your total expenses are ${formatINR(totalExpenses)}. Top spending categories:\n${
      topCategories.map(([category, amount]) => 
        `- ${category}: ${formatINR(amount)}`
      ).join('\n')
    }`;
  }

  if (messageNormalized.includes('transaction') || messageNormalized.includes('recent')) {
    const recentExpenses = expenses
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);

    return `Here are your most recent transactions:\n${
      recentExpenses.map(expense => 
        `- ${format(expense.date, 'MMM d')}: ${expense.description || expense.category} - ${formatINR(expense.amount)}`
      ).join('\n')
    }`;
  }

  // Default response
  return `I can help you with basic financial information. Your total income is ${formatINR(totalIncome)}, total expenses are ${formatINR(totalExpenses)}, and your savings rate is ${savingsRate.toFixed(1)}%. What would you like to know more about?`;
}