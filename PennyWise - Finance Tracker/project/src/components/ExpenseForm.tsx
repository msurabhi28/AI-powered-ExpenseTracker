import React, { useState } from 'react';
import { PlusCircle, IndianRupee, Tag, Calendar, Coffee, Bus, Home, Zap, Gamepad2, Heart, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { ExpenseCategory } from '../types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: Date;
  }) => void;
}

const categoryIcons = {
  Food: Coffee,
  Transportation: Bus,
  Housing: Home,
  Utilities: Zap,
  Entertainment: Gamepad2,
  Healthcare: Heart,
  Shopping: ShoppingBag,
  Other: MoreHorizontal,
};

const categories: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other',
];

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Other');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddExpense({
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
    });

    setAmount('');
    setCategory('Other');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const today = new Date().toISOString().split('T')[0];
  const CategoryIcon = categoryIcons[category];

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Add New Expense</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input pl-10 w-full bg-blue-50 dark:bg-blue-800"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            Category
          </label>
          <div className="relative">
            <CategoryIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="input pl-10 w-full bg-blue-50 dark:bg-blue-800"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full bg-blue-50 dark:bg-blue-800"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="input pl-10 w-full bg-blue-50 dark:bg-blue-800"
              required
            />
          </div>
        </div>
      </div>

      <button type="submit" className="button w-full flex items-center justify-center">
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Expense
      </button>
    </form>
  );
}