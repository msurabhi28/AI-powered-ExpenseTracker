export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Housing'
  | 'Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Other';

export interface ExpenseCommand {
  action: 'add' | 'remove';
  type: 'income' | 'expense';
  amount: number | null;
  category: string;
  description: string | null;
  date: string;
}