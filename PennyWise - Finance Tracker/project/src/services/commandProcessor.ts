import { translateText } from './translationService';
import { parseCommand } from './commandParser';
import { ExpenseCommand } from '../types/expense';
import { authService } from './authService';

export async function processCommand(text: string): Promise<string> {
  try {
    // Get current user
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Please log in to add expenses.');
    }

    // Detect language and translate if needed
    const translatedText = await translateText(text);
    
    // Parse the command
    const command = await parseCommand(translatedText);
    if (!command) {
      throw new Error('Invalid command format. Please use: "add [income/expense] [amount] [category] [date]"');
    }
    
    // Get current user data
    const userData = authService.getUserData(currentUser.id);
    
    if (command.type === 'expense') {
      const expense = {
        id: crypto.randomUUID(),
        amount: command.amount!,
        category: command.category,
        description: command.description || '',
        date: new Date(command.date)
      };
      
      // Update user data
      userData.expenses.push(expense);
      authService.updateUserData(currentUser.id, userData);
      
      return `Successfully added expense of ₹${command.amount} for ${command.category} on ${format(new Date(command.date), 'dd/MM/yyyy')}.`;
    } else {
      const income = {
        id: crypto.randomUUID(),
        amount: command.amount!,
        description: command.description || 'Voice added income',
        date: new Date(command.date),
        type: 'one-time' as const
      };
      
      // Update user data
      userData.additionalIncomes.push(income);
      authService.updateUserData(currentUser.id, userData);
      
      return `Successfully added income of ₹${command.amount} on ${format(new Date(command.date), 'dd/MM/yyyy')}.`;
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to process command');
  }
}