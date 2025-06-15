export interface Income {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: 'monthly' | 'one-time';
}