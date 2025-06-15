import { ExpenseCommand } from '../types/expense';
import { format } from 'date-fns';

const AMOUNT_PATTERNS = [
  /(?:rupees|rs\.?|₹)\s*(\d+)/i,
  /(\d+)\s*(?:rupees|rs\.?|₹)/i,
  /(\d+)/
];

const CATEGORY_PATTERNS = {
  Food: /(?:food|meal|restaurant|grocery|groceries)/i,
  Transportation: /(?:transport|travel|bus|train|taxi|uber|ola|fuel|petrol)/i,
  Housing: /(?:house|rent|maintenance|repair)/i,
  Utilities: /(?:utility|electricity|water|gas|internet|phone|mobile)/i,
  Entertainment: /(?:entertainment|movie|game|sport|fun)/i,
  Healthcare: /(?:health|medical|doctor|medicine|hospital)/i,
  Shopping: /(?:shop|purchase|buy|clothes|clothing)/i,
  Other: /./
};

const DATE_PATTERN = /(?:on|for|dated?)\s+(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/i;

export async function parseCommand(text: string): Promise<ExpenseCommand | null> {
  const input = text.toLowerCase();
  
  // Validate command structure
  if (!input.startsWith('add')) {
    throw new Error('Command must start with "add"');
  }

  // Determine if it's an income or expense
  const isIncome = /add\s+income/.test(input);
  const isExpense = /add\s+expense/.test(input);

  if (!isIncome && !isExpense) {
    throw new Error('Please specify if you want to add an income or expense');
  }

  // Initialize command
  const command: ExpenseCommand = {
    action: 'add',
    type: isIncome ? 'income' : 'expense',
    amount: null,
    category: 'Other',
    description: null,
    date: format(new Date(), 'yyyy-MM-dd')
  };

  // Extract amount
  for (const pattern of AMOUNT_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      command.amount = parseInt(match[1], 10);
      break;
    }
  }

  if (!command.amount) {
    throw new Error('Please specify an amount');
  }

  // Extract category (for expenses only)
  if (isExpense) {
    for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
      if (pattern.test(input)) {
        command.category = category;
        break;
      }
    }
  }

  // Extract date
  const dateMatch = input.match(DATE_PATTERN);
  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    const fullYear = year.length === 2 ? `20${year}` : year;
    command.date = format(new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day)), 'yyyy-MM-dd');
  }

  return command;
}