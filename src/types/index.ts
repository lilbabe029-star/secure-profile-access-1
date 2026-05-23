export interface User {
  id: string;
  email: string;
  fullName: string;
  country: string;
  currency: string;
  role: 'user' | 'admin';
  balance: number; // Stored in USD, converted for display
  unlockedProfiles: string[];
}

export interface Profile {
  id: string;
  fullName: string;
  city: string;
  state: string;
  phoneNumber: string;
  occupation: string;
  dob: string;
  bio: string;
  notes: string;
  imageUrl: string;
  status: 'Active' | 'Premium' | 'Verified';
  price: number; // In USD
}

export interface Deposit {
  id: string;
  userId: string;
  userEmail: string;
  amount: number; // Original USD amount
  localAmount: number;
  localCurrency: string;
  transactionRef: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'unlock';
  amount: number; // In USD
  description: string;
  createdAt: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // 1 USD = X Local
}