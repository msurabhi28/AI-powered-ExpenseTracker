import Fuse from 'fuse.js';
import { format, subMonths, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { generateAIResponse } from './openaiService';
import { generateFallbackResponse } from './fallbackService';
import { Expense } from '../types/expense';
import { Income } from '../types/income';
import { formatINR } from '../utils/currency';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initializeFuse = (expenses: Expense[]) => {
  return new Fuse(expenses, {
    keys: ['description', 'category'],
    threshold: 0.4,
    includeScore: true
  });
};

export async function processUserMessage(
  message: string,
  chatHistory: Message[]
): Promise<string> {
  try {
    // Get data from localStorage
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]').map((expense: any) => ({
      ...expense,
      date: new Date(expense.date)
    }));
    const monthlyIncome = parseFloat(localStorage.getItem('monthlyIncome') || '0');
    const additionalIncomes = JSON.parse(localStorage.getItem('additionalIncomes') || '[]').map((income: any) => ({
      ...income,
      date: new Date(income.date)
    }));

    try {
      return await generateAIResponse(message, {
        expenses,
        monthlyIncome,
        additionalIncomes,
        recentMessages: chatHistory.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });
    } catch (error) {
      console.error('OpenAI service error:', error);
      return generateFallbackResponse(message, {
        expenses,
        monthlyIncome,
        additionalIncomes
      });
    }
  } catch (error) {
    console.error('Chat processing error:', error);
    return "I apologize, but I encountered an error accessing your financial data. Please try again later.";
  }
}