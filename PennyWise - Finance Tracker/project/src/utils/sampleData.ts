import { Expense } from '../types/expense';
import { Income } from '../types/income';
import { subDays } from 'date-fns';

export const sampleExpenses: Expense[] = [
  {
    id: '1',
    amount: 2500,
    category: 'Food',
    description: 'Grocery shopping',
    date: subDays(new Date(), 2),
  },
  {
    id: '2',
    amount: 1500,
    category: 'Transportation',
    description: 'Fuel',
    date: subDays(new Date(), 4),
  },
  {
    id: '3',
    amount: 5000,
    category: 'Entertainment',
    description: 'Movie night',
    date: subDays(new Date(), 6),
  },
  {
    id: '4',
    amount: 20000,
    category: 'Housing',
    description: 'Rent',
    date: subDays(new Date(), 8),
  },
  {
    id: '5',
    amount: 3000,
    category: 'Utilities',
    description: 'Electricity bill',
    date: subDays(new Date(), 10),
  },
];

export const sampleIncomes: Income[] = [
  {
    id: '1',
    amount: 50000,
    description: 'Monthly salary',
    date: new Date(),
    type: 'monthly',
  },
  {
    id: '2',
    amount: 10000,
    description: 'Freelance work',
    date: subDays(new Date(), 15),
    type: 'one-time',
  },
];