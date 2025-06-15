import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';
import { Expense } from '../types/expense';
import { Income } from '../types/income';
import { formatINR } from '../utils/currency';
import { generateFallbackResponse } from './fallbackService';

// Initialize OpenAI only if API key is available
const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

interface FinancialContext {
  expenses: Expense[];
  monthlyIncome: number;
  additionalIncomes: Income[];
  recentMessages: { role: string; content: string; }[];
}

export async function generateAIResponse(
  userMessage: string,
  context: FinancialContext
): Promise<string> {
  // If OpenAI is not initialized, use fallback response
  if (!openai) {
    console.log('OpenAI API key not found, using fallback response generator');
    return generateFallbackResponse(userMessage, {
      expenses: context.expenses,
      monthlyIncome: context.monthlyIncome,
      additionalIncomes: context.additionalIncomes
    });
  }

  const { expenses, monthlyIncome, additionalIncomes, recentMessages } = context;

  // Calculate key financial metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalAdditionalIncome = additionalIncomes.reduce((sum, income) => sum + income.amount, 0);
  const savingsRate = ((monthlyIncome + totalAdditionalIncome - totalExpenses) / (monthlyIncome + totalAdditionalIncome)) * 100;

  // Create a context message with current financial data
  const contextMessage = `Current financial status:
- Monthly Income: ${formatINR(monthlyIncome)}
- Additional Income: ${formatINR(totalAdditionalIncome)}
- Total Expenses: ${formatINR(totalExpenses)}
- Savings Rate: ${savingsRate.toFixed(1)}%

Recent transactions:
${expenses.slice(-5).map(expense => 
  `- ${expense.category}: ${formatINR(expense.amount)} (${expense.description || 'No description'})`
).join('\n')}`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.max_tokens,
      messages: [
        { role: 'system', content: OPENAI_CONFIG.systemPrompt },
        { role: 'system', content: contextMessage },
        ...recentMessages.slice(-5),
        { role: 'user', content: userMessage }
      ]
    });

    return response.choices[0]?.message?.content || 
           generateFallbackResponse(userMessage, { expenses, monthlyIncome, additionalIncomes });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return generateFallbackResponse(userMessage, { expenses, monthlyIncome, additionalIncomes });
  }
}