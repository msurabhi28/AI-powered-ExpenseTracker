import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Expense } from '../types/expense';
import { Income } from '../types/income';
import { formatINR } from '../utils/currency';
import { TrendingUp, ArrowUpRight, Users, Activity, Calendar } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { RiskGaugeMeter } from './RiskGaugeMeter';

interface DashboardProps {
  expenses: Expense[];
  monthlyIncome: number;
  additionalIncomes: Income[];
}

const COLORS = ['#4285F4', '#5C9FFF', '#76B4FF', '#90C9FF', '#AADEFF', '#C4F3FF', '#DEF8FF', '#F8FDFF'];

export function Dashboard({ expenses, monthlyIncome, additionalIncomes }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM'));
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = monthlyIncome + additionalIncomes.reduce((sum, income) => sum + income.amount, 0);
  const remainingBudget = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (remainingBudget / totalIncome) * 100 : 0;

  const getSavingsRateColor = (rate: number) => {
    if (rate <= 0) return 'text-red-500 dark:text-red-400';
    if (rate < 20) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  const selectedMonthStart = startOfMonth(parseISO(`${selectedDate}-01`));
  const selectedMonthEnd = endOfMonth(selectedMonthStart);

  const monthlyData = Array.from(
    { length: selectedMonthEnd.getDate() },
    (_, i) => {
      const date = new Date(selectedMonthStart.getFullYear(), selectedMonthStart.getMonth(), i + 1);
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const dayExpenses = expenses
        .filter(expense => format(expense.date, 'yyyy-MM-dd') === formattedDate)
        .reduce((sum, expense) => sum + expense.amount, 0);

      const dayIncomes = additionalIncomes
        .filter(income => format(income.date, 'yyyy-MM-dd') === formattedDate)
        .reduce((sum, income) => sum + income.amount, 0);

      return {
        date: format(date, 'MMM dd'),
        expenses: dayExpenses,
        income: dayIncomes + (monthlyIncome / selectedMonthEnd.getDate()),
      };
    }
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <p className="text-blue-600 dark:text-white">Total Income</p>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <TrendingUp className="text-blue-500 dark:text-white" size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-4 dark:text-white">{formatINR(totalIncome)}</h3>
          <div className="flex items-center mt-2 text-blue-500 dark:text-white">
            <ArrowUpRight size={16} className="mr-1" />
            <span className="text-sm">Monthly: {formatINR(monthlyIncome)}</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <p className="text-blue-600 dark:text-white">Total Expenses</p>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Activity className="text-blue-500 dark:text-white" size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-4 dark:text-white">{formatINR(totalExpenses)}</h3>
          <div className="flex items-center mt-2 text-blue-500 dark:text-white">
            <Users size={16} className="mr-1" />
            <span className="text-sm">{expenses.length} transactions</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <p className="text-blue-600 dark:text-white">Savings Rate</p>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <TrendingUp className="text-blue-500 dark:text-white" size={20} />
            </div>
          </div>
          <h3 className={`text-2xl font-bold mt-4 ${getSavingsRateColor(savingsRate)}`}>
            {savingsRate.toFixed(1)}%
          </h3>
          <div className={`flex items-center mt-2 ${getSavingsRateColor(savingsRate)}`}>
            <ArrowUpRight size={16} className="mr-1" />
            <span className="text-sm">{formatINR(remainingBudget)} remaining</span>
          </div>
        </div>
      </div>

      {/* Risk Gauge Meter */}
      <div className="card">
        <RiskGaugeMeter
          monthlyIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-white">Income vs Expenses</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500 dark:text-white" />
              <input
                type="month"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input py-1 dark:text-white"
              />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#4285F4" 
                  tick={{ fill: 'currentColor' }}
                  className="dark:text-white" 
                />
                <YAxis 
                  stroke="#4285F4" 
                  tick={{ fill: 'currentColor' }}
                  className="dark:text-white"
                />
                <Tooltip 
                  formatter={(value) => formatINR(value as number)}
                  contentStyle={{
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    border: '1px solid rgba(66, 133, 244, 0.2)',
                    color: 'currentColor',
                  }}
                  labelStyle={{
                    color: 'currentColor',
                  }}
                />
                <Legend 
                  formatter={(value) => <span className="dark:text-white">{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#4285F4" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#90C9FF" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-white">Expense Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#4285F4"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatINR(value as number)}
                  contentStyle={{
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    border: '1px solid rgba(66, 133, 244, 0.2)',
                    color: 'currentColor',
                  }}
                  labelStyle={{
                    color: 'currentColor',
                  }}
                />
                <Legend 
                  formatter={(value) => <span className="dark:text-white">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}