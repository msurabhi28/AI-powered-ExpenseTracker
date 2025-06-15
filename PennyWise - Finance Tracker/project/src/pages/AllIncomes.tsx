import React, { useState } from 'react';
import { Income } from '../types/income';
import { formatINR } from '../utils/currency';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IncomeList } from '../components/IncomeList';
import { EditIncomeModal } from '../components/EditIncomeModal';

interface AllIncomesProps {
  monthlyIncome: number;
  additionalIncomes: Income[];
  onDeleteIncome: (id: string) => void;
  onUpdateIncome: (updatedIncome: Income) => void;
}

export function AllIncomes({ 
  monthlyIncome, 
  additionalIncomes, 
  onDeleteIncome,
  onUpdateIncome 
}: AllIncomesProps) {
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="button-outline mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">All Incomes</h1>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Monthly Income</h2>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{formatINR(monthlyIncome)}</p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Additional Incomes</h2>
        <IncomeList
          incomes={additionalIncomes}
          onDelete={onDeleteIncome}
          onEdit={setEditingIncome}
        />
      </div>

      {editingIncome && (
        <EditIncomeModal
          income={editingIncome}
          onClose={() => setEditingIncome(null)}
          onSave={onUpdateIncome}
        />
      )}
    </div>
  );
}