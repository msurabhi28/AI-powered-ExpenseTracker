import React, { useState, useEffect } from 'react';
import { X, IndianRupee, Calendar } from 'lucide-react';
import { Income } from '../types/income';

interface EditIncomeModalProps {
  income: Income | null;
  onClose: () => void;
  onSave: (income: Income) => void;
}

export function EditIncomeModal({ income, onClose, onSave }: EditIncomeModalProps) {
  const [amount, setAmount] = useState(income?.amount.toString() || '');
  const [description, setDescription] = useState(income?.description || '');
  const [date, setDate] = useState(
    income?.date ? new Date(income.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [type, setType] = useState<'monthly' | 'one-time'>(income?.type || 'one-time');

  useEffect(() => {
    if (income) {
      setAmount(income.amount.toString());
      setDescription(income.description);
      setDate(new Date(income.date).toISOString().split('T')[0]);
      setType(income.type);
    }
  }, [income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !income) return;

    onSave({
      ...income,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      type,
    });
    onClose();
  };

  if (!income) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-blue-900 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Edit Income</h3>
          <button
            onClick={onClose}
            className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-type" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Income Type
            </label>
            <select
              id="edit-type"
              value={type}
              onChange={(e) => setType(e.target.value as 'monthly' | 'one-time')}
              className="input w-full bg-blue-50 dark:bg-blue-800"
            >
              <option value="monthly">Monthly Income</option>
              <option value="one-time">One-time Income</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-amount" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="number"
                id="edit-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input pl-10 w-full bg-blue-50 dark:bg-blue-800"
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Description
            </label>
            <input
              type="text"
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full bg-blue-50 dark:bg-blue-800"
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="date"
                id="edit-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input pl-10 w-full bg-blue-50 dark:bg-blue-800"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}