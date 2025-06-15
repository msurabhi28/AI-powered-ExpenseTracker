import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { authService } from './services/authService';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { IncomeForm } from './components/IncomeForm';
import { AdviceWidget } from './components/AdviceWidget';
import { ChatWindow } from './components/Chatbot/ChatWindow';
import { LoginPage } from './components/auth/LoginPage';
import { UserProfile } from './components/auth/UserProfile';
import { AllExpenses } from './pages/AllExpenses';
import { AllIncomes } from './pages/AllIncomes';
import { Sidebar } from './components/Sidebar';
import { SpeechButton } from './components/SpeechCommand/SpeechButton';
import { Expense, ExpenseCategory } from './types/expense';
import { Income } from './types/income';
import { Wallet, Sun, Moon, Menu } from 'lucide-react';

function App() {
  const { isLoading, user } = useAuth();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [monthlyIncome, setMonthlyIncome] = React.useState<number>(0);
  const [additionalIncomes, setAdditionalIncomes] = React.useState<Income[]>([]);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Load user-specific data
  React.useEffect(() => {
    if (user) {
      const userData = authService.getUserData(user.id);
      setExpenses(userData.expenses.map((e: any) => ({ ...e, date: new Date(e.date) })));
      setMonthlyIncome(userData.monthlyIncome);
      setAdditionalIncomes(userData.additionalIncomes.map((i: any) => ({ ...i, date: new Date(i.date) })));
    }
  }, [user]);

  // Save user data when it changes
  React.useEffect(() => {
    if (user) {
      authService.updateUserData(user.id, {
        expenses,
        monthlyIncome,
        additionalIncomes,
      });
    }
  }, [user, expenses, monthlyIncome, additionalIncomes]);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleAddExpense = (expenseData: {
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: Date;
  }) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...expenseData,
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter(expense => expense.id !== id));
  };

  const handleAddIncome = (incomeData: Omit<Income, 'id'>) => {
    if (incomeData.type === 'monthly') {
      setMonthlyIncome(incomeData.amount);
    } else {
      const newIncome: Income = {
        id: crypto.randomUUID(),
        ...incomeData,
      };
      setAdditionalIncomes((prev) => [...prev, newIncome]);
    }
  };

  const handleDeleteIncome = (id: string) => {
    setAdditionalIncomes((prev) => prev.filter(income => income.id !== id));
  };

  const handleUpdateIncome = (updatedIncome: Income) => {
    if (updatedIncome.type === 'monthly') {
      setMonthlyIncome(updatedIncome.amount);
      setAdditionalIncomes((prev) => prev.filter(income => income.id !== updatedIncome.id));
    } else {
      setAdditionalIncomes((prev) =>
        prev.map(income => income.id === updatedIncome.id ? updatedIncome : income)
      );
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-blue-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-blue-500 dark:hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Wallet className="w-8 h-8" />
                <h1 className="text-2xl font-bold">PennyWise</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <SpeechButton />
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-blue-500 dark:hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Dashboard 
                  expenses={expenses} 
                  monthlyIncome={monthlyIncome}
                  additionalIncomes={additionalIncomes}
                />
                <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
              </div>
              <div className="space-y-8">
                <IncomeForm 
                  onAddIncome={handleAddIncome} 
                  currentIncome={monthlyIncome}
                  additionalIncomes={additionalIncomes}
                />
                <ExpenseForm onAddExpense={handleAddExpense} />
              </div>
            </div>
          } />
          <Route path="/expenses" element={
            <AllExpenses expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          } />
          <Route path="/incomes" element={
            <AllIncomes 
              monthlyIncome={monthlyIncome} 
              additionalIncomes={additionalIncomes} 
              onDeleteIncome={handleDeleteIncome}
              onUpdateIncome={handleUpdateIncome}
            />
          } />
        </Routes>
      </main>

      <footer className="bg-blue-600 dark:bg-blue-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 405 Found. All rights reserved.
          </p>
        </div>
      </footer>

      <ChatWindow />

      <AdviceWidget
        monthlyIncome={monthlyIncome}
        expenses={expenses}
      />
    </div>
  );
}

export default App;