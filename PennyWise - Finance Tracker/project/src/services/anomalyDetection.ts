import { Expense } from '../types/expense';
import { formatINR } from '../utils/currency';
import { subMonths, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

interface AnomalyResult {
  isAnomaly: boolean;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export function detectAnomalies(expenses: Expense[]): Map<string, AnomalyResult> {
  const anomalies = new Map<string, AnomalyResult>();
  
  // Skip if not enough data
  if (expenses.length < 2) return anomalies;

  // Calculate baseline metrics
  const categoryAverages = calculateCategoryAverages(expenses);
  const categoryStdDevs = calculateCategoryStdDevs(expenses, categoryAverages);
  
  // Check each expense for anomalies
  expenses.forEach(expense => {
    const result = analyzeExpense(expense, {
      categoryAverages,
      categoryStdDevs,
      expenses
    });
    
    if (result.isAnomaly) {
      anomalies.set(expense.id, result);
    }
  });

  return anomalies;
}

function calculateCategoryAverages(expenses: Expense[]): Map<string, number> {
  const categoryData = new Map<string, { total: number; count: number }>();

  expenses.forEach(expense => {
    const current = categoryData.get(expense.category) || { total: 0, count: 0 };
    categoryData.set(expense.category, {
      total: current.total + expense.amount,
      count: current.count + 1
    });
  });

  const averages = new Map<string, number>();
  categoryData.forEach((data, category) => {
    // Calculate average excluding extreme outliers
    const values = expenses
      .filter(e => e.category === category)
      .map(e => e.amount)
      .sort((a, b) => a - b);
    
    // Remove top and bottom 10% for more robust average
    const start = Math.floor(values.length * 0.1);
    const end = Math.ceil(values.length * 0.9);
    const trimmedValues = values.slice(start, end);
    
    const trimmedAverage = trimmedValues.length > 0
      ? trimmedValues.reduce((sum, val) => sum + val, 0) / trimmedValues.length
      : data.total / data.count;

    averages.set(category, trimmedAverage);
  });

  return averages;
}

function calculateCategoryStdDevs(
  expenses: Expense[],
  averages: Map<string, number>
): Map<string, number> {
  const stdDevs = new Map<string, number>();

  Array.from(averages.entries()).forEach(([category, avg]) => {
    const categoryExpenses = expenses.filter(e => e.category === category);
    const squaredDiffs = categoryExpenses.map(e => Math.pow(e.amount - avg, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / categoryExpenses.length;
    stdDevs.set(category, Math.sqrt(variance));
  });

  return stdDevs;
}

interface AnalysisContext {
  categoryAverages: Map<string, number>;
  categoryStdDevs: Map<string, number>;
  expenses: Expense[];
}

function analyzeExpense(expense: Expense, context: AnalysisContext): AnomalyResult {
  const { categoryAverages, categoryStdDevs, expenses } = context;
  
  const categoryAvg = categoryAverages.get(expense.category) || expense.amount;
  const categoryStdDev = categoryStdDevs.get(expense.category) || 0;

  // Define thresholds
  const HIGH_AMOUNT_THRESHOLD = 3; // 3x average
  const MEDIUM_AMOUNT_THRESHOLD = 2; // 2x average
  const FREQUENCY_THRESHOLD = 3; // 3 similar transactions in short period
  const Z_SCORE_THRESHOLD = 2.5; // Number of standard deviations for outlier

  // Calculate z-score for statistical significance
  const zScore = categoryStdDev !== 0 
    ? (expense.amount - categoryAvg) / categoryStdDev
    : 0;

  // Check for amount-based anomalies
  const amountRatio = expense.amount / categoryAvg;
  
  if (amountRatio >= HIGH_AMOUNT_THRESHOLD && zScore > Z_SCORE_THRESHOLD) {
    return {
      isAnomaly: true,
      reason: `Unusually high amount for ${expense.category}`,
      severity: 'high',
      suggestion: `This amount (${formatINR(expense.amount)}) is ${amountRatio.toFixed(1)}x higher than your usual ${
        expense.category.toLowerCase()
      } expenses (avg: ${formatINR(categoryAvg)}). Consider reviewing this transaction.`
    };
  }

  // Check for frequency-based anomalies
  const similarTransactions = expenses.filter(e => 
    e.category === expense.category &&
    e.id !== expense.id && // Exclude current transaction
    Math.abs(e.amount - expense.amount) / expense.amount < 0.2 && // Within 20% of amount
    isWithinInterval(e.date, {
      start: subMonths(expense.date, 1),
      end: expense.date
    })
  );

  if (similarTransactions.length >= FREQUENCY_THRESHOLD) {
    return {
      isAnomaly: true,
      reason: `Unusual frequency of similar ${expense.category.toLowerCase()} transactions`,
      severity: 'medium',
      suggestion: `You've had ${similarTransactions.length} similar ${
        expense.category.toLowerCase()
      } transactions in the past month. Consider reviewing these expenses.`
    };
  }

  // Check for moderate anomalies
  if (amountRatio >= MEDIUM_AMOUNT_THRESHOLD && zScore > Z_SCORE_THRESHOLD / 2) {
    return {
      isAnomaly: true,
      reason: `Higher than usual ${expense.category.toLowerCase()} expense`,
      severity: 'low',
      suggestion: `This ${expense.category.toLowerCase()} expense is ${amountRatio.toFixed(1)}x higher than your average of ${
        formatINR(categoryAvg)
      }. Consider if this is a one-time expense or a changing pattern.`
    };
  }

  return {
    isAnomaly: false,
    reason: '',
    severity: 'low',
    suggestion: ''
  };
}