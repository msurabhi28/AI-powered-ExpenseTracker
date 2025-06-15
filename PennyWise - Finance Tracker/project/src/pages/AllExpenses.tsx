import React from 'react';
import { ExpenseList } from '../components/ExpenseList';
import { Expense } from '../types/expense';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AllExpensesProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function AllExpenses({ expenses, onDeleteExpense }: AllExpensesProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="button-outline mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-magenta-800 dark:text-magenta-200">All Expenses</h1>
      </div>
      <ExpenseList expenses={expenses} onDelete={onDeleteExpense} limit={Infinity} />
    </div>
  );
}