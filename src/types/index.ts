// Common types and interfaces for the application

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}