import { User } from '../types/user';
import { sampleExpenses, sampleIncomes } from '../utils/sampleData';

interface AuthCredentials {
  email: string;
  password: string;
}

interface UserData {
  expenses: any[];
  monthlyIncome: number;
  additionalIncomes: any[];
}

export const authService = {
  signup: async (credentials: AuthCredentials): Promise<User> => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (existingUsers.some((user: User) => user.email === credentials.email)) {
      throw new Error('User already exists');
    }

    const userId = crypto.randomUUID();
    const newUser: User = {
      id: userId,
      email: credentials.email,
      name: credentials.email.split('@')[0],
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email.split('@')[0])}&background=random`,
    };

    // Initialize user data - only for the first user
    const isFirstUser = existingUsers.length === 0;
    const initialData: UserData = {
      expenses: isFirstUser ? sampleExpenses : [],
      monthlyIncome: isFirstUser ? 50000 : 0,
      additionalIncomes: isFirstUser ? sampleIncomes : [],
    };

    // Store user data
    localStorage.setItem(`userData_${userId}`, JSON.stringify(initialData));
    
    // Store user credentials
    existingUsers.push({ ...newUser, password: credentials.password });
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Store current session
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  },

  login: async (credentials: AuthCredentials): Promise<User> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User & { password: string }) => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Store current session
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  logout: () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  getUserData: (userId: string): UserData => {
    const dataStr = localStorage.getItem(`userData_${userId}`);
    if (!dataStr) {
      return {
        expenses: [],
        monthlyIncome: 0,
        additionalIncomes: [],
      };
    }
    return JSON.parse(dataStr);
  },

  updateUserData: (userId: string, data: UserData): void => {
    localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
  },
};