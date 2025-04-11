import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Expense {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

// Sample expense categories
const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Personal Care'
];

// Sample payment methods
const paymentMethods = [
  'Credit Card',
  'Debit Card',
  'UPI',
  'Cash',
  'Net Banking',
  'Wallet'
];

// Sample descriptions
const descriptions = [
  'Monthly grocery shopping',
  'Dinner at restaurant',
  'Fuel for vehicle',
  'Movie tickets',
  'Electricity bill',
  'Doctor consultation',
  'Online course',
  'Flight tickets',
  'Monthly rent',
  'Gym membership'
];

// Generate random date within last 3 months
const getRandomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  return new Date(threeMonthsAgo.getTime() + Math.random() * (new Date().getTime() - threeMonthsAgo.getTime()));
};

// Generate random amount between 100 and 10000
const getRandomAmount = () => Math.floor(Math.random() * (10000 - 100 + 1)) + 100;

// Generate sample expenses
const generateSampleExpenses = (count: number): Expense[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: Math.random().toString(36).substr(2, 9),
    date: getRandomDate(),
    category: categories[Math.floor(Math.random() * categories.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    amount: getRandomAmount(),
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    status: Math.random() > 0.3 ? 'completed' : 'pending',
    notes: Math.random() > 0.7 ? 'Important expense' : undefined
  }));
};

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(generateSampleExpenses(50));

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}; 