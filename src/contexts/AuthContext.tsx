import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('black_sense_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('black_sense_user', JSON.stringify(user));
      
      // Sync with global users list
      const allUsers = JSON.parse(localStorage.getItem('black_sense_users') || '[]');
      const updatedUsers = allUsers.map((u: User) => u.id === user.id ? user : u);
      localStorage.setItem('black_sense_users', JSON.stringify(updatedUsers));
    } else {
      localStorage.removeItem('black_sense_user');
    }
  }, [user]);

  const login = async (email: string, _password: string) => {
    // Demo login: check if admin or regular user
    const allUsers = JSON.parse(localStorage.getItem('black_sense_users') || '[]');
    const foundUser = allUsers.find((u: User) => u.email === email);

    if (foundUser) {
      setUser(foundUser);
    } else if (email === 'admin@blacksense.com') {
      const adminUser: User = {
        id: 'admin',
        email: 'admin@blacksense.com',
        fullName: 'Platform Admin',
        country: 'United States',
        currency: 'USD',
        role: 'admin',
        balance: 0,
        unlockedProfiles: []
      };
      setUser(adminUser);
      
      // Save admin to list if not exists
      if (!allUsers.find((u: User) => u.email === adminUser.email)) {
        localStorage.setItem('black_sense_users', JSON.stringify([...allUsers, adminUser]));
      }
    } else {
      throw new Error('User not found. Please register first.');
    }
  };

  const register = async (data: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email || '',
      fullName: data.fullName || '',
      country: data.country || 'Ghana',
      currency: data.currency || 'GHS',
      role: 'user',
      balance: 0,
      unlockedProfiles: [],
      ...data
    };

    const allUsers = JSON.parse(localStorage.getItem('black_sense_users') || '[]');
    if (allUsers.find((u: User) => u.email === newUser.email)) {
      throw new Error('Email already registered.');
    }

    localStorage.setItem('black_sense_users', JSON.stringify([...allUsers, newUser]));
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};