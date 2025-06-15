import React from 'react';
import { format } from 'date-fns';
import { Income } from '../types/income';
import { formatINR } from '../utils/currency';
import { DeleteConfirmation } from './DeleteConfirmation';
import { Edit2 } from 'lucide-react';

interface IncomeListProps {
  incomes: Income[];
  onDelete: (id: string) => void;
  onEdit: (income: Income) => void;
}

export function IncomeList({ incomes, onDelete, onEdit }: IncomeListProps) {
  const sortedIncomes = [...incomes].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-4">
      {sortedIncomes.map((income) => (
        <div
          key={income.id}
          className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-800/50 rounded-xl hover:bg-blue-100/50 dark:hover:bg-blue-700/50 transition-colors"
        >
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100">{income.description}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {format(income.date, 'MMM d, yyyy')} • {income.type}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-semibold text-blue-600 dark:text-blue-300">
              {formatINR(income.amount)}
            </p>
            <button
              onClick={() => onEdit(income)}
              className="p-2 text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300"
            >
              <Edit2 size={18} />
            </button>
            <DeleteConfirmation onDelete={() => onDelete(income.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}