import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Calendar } from 'lucide-react';
import { Income } from '../types/income';

interface IncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  currentIncome: number;
  additionalIncomes: Income[];
}

export function IncomeForm({ onAddIncome, currentIncome, additionalIncomes }: IncomeFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'monthly' | 'one-time'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAddIncome({
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      type,
    });

    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('monthly');
  };

  const today = new Date().toISOString().split('T')[0];
  const totalAdditionalIncome = additionalIncomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Income</h3>
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300">
          <IndianRupee size={20} />
          <span className="font-semibold">{(currentIncome + totalAdditionalIncome).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            Income Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'monthly' | 'one-time')}
            className="input w-full bg-blue-50 dark:bg-blue-800"
          >
            <option value="monthly">Monthly Income</option>
            <option value="one-time">One-time Income</option>
          </select>
        </div>

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
              placeholder="Enter amount"
              required
            />
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
            required
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
        <TrendingUp className="w-5 h-5 mr-2" />
        Add Income
      </button>
    </form>
  );
}