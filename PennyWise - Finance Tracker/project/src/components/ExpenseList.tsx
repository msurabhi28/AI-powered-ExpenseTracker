import React from 'react';
import { format } from 'date-fns';
import { Expense } from '../types/expense';
import { formatINR } from '../utils/currency';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DeleteConfirmation } from './DeleteConfirmation';
import { detectAnomalies } from '../services/anomalyDetection';
import { AnomalyAlert } from './AnomalyAlert';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
  limit?: number;
}

export function ExpenseList({ expenses, onDelete, limit = 5 }: ExpenseListProps) {
  const sortedExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);

  const anomalies = detectAnomalies(expenses);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-magenta-800 dark:text-magenta-200">Recent Transactions</h3>
        <Link to="/expenses" className="button-outline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {sortedExpenses.map((expense) => (
          <div key={expense.id}>
            <div className="flex items-center justify-between p-4 bg-magenta-50/50 dark:bg-magenta-800/50 rounded-xl hover:bg-magenta-100/50 dark:hover:bg-magenta-700/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-magenta-100 dark:bg-magenta-700 rounded-xl">
                  <ArrowUpRight className="w-5 h-5 text-magenta-600 dark:text-magenta-300" />
                </div>
                <div>
                  <p className="font-medium text-magenta-900 dark:text-magenta-100">
                    {expense.description || expense.category}
                  </p>
                  <p className="text-sm text-magenta-600 dark:text-magenta-400">
                    {format(expense.date, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-magenta-600 dark:text-magenta-300">
                    -{formatINR(expense.amount)}
                  </p>
                  <p className="text-sm text-magenta-500 dark:text-magenta-400">{expense.category}</p>
                </div>
                {onDelete && (
                  <DeleteConfirmation onDelete={() => onDelete(expense.id)} />
                )}
              </div>
            </div>
            {anomalies.has(expense.id) && (
              <AnomalyAlert 
                expense={expense} 
                anomaly={anomalies.get(expense.id)!}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}