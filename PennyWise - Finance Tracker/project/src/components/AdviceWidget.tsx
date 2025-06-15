import React from 'react';
import { getFinancialAdvice } from '../services/aiAdvice';
import { Lightbulb, ExternalLink, X } from 'lucide-react';

interface AdviceWidgetProps {
  monthlyIncome: number;
  expenses: Array<{
    amount: number;
    category: string;
  }>;
}

export function AdviceWidget({ monthlyIncome, expenses }: AdviceWidgetProps) {
  const [advice, setAdvice] = React.useState<string>('');
  const [isVisible, setIsVisible] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = monthlyIncome - totalExpenses;
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const fetchAdvice = async () => {
      try {
        setIsLoading(true);
        const newAdvice = await getFinancialAdvice({
          monthlyIncome,
          totalExpenses,
          remainingBudget,
          expensesByCategory,
        });
        setAdvice(newAdvice);
      } catch (error) {
        console.error('Error getting financial advice:', error);
        setAdvice('Consider maintaining a balanced budget between expenses and savings.');
      } finally {
        setIsLoading(false);
      }
    };

    if (monthlyIncome > 0) {
      fetchAdvice();
    }
  }, [monthlyIncome, expenses]);

  if (!monthlyIncome || isLoading || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm">
      <div className="bg-red-50 rounded-lg shadow-lg p-4 border-l-4 border-red-400 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start space-x-3 pt-2">
          <Lightbulb className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600">{advice}</p>
            <a
              href="https://economictimes.indiatimes.com/markets/stocks/news"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Learn More
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}