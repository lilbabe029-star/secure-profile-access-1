import { Currency } from '../types';

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'GHS', name: 'Ghana Cedi', symbol: 'GH₵', rate: 16.2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1650 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 129.5 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.5 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', rate: 3680 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', rate: 1370 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 48.5 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', rate: 10.1 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', rate: 115.0 },
];

export const US_STATES = [
  'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
];

export const US_CITIES = [
  'New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
];

export const OCCUPATIONS = [
  'Software Engineer', 'Real Estate Agent', 'Marketing Director', 'Accountant', 'Financial Advisor', 'Project Manager', 'Architect', 'Attorney', 'Consultant', 'Executive'
];

export const UNLOCK_PRICES = [9, 10, 15, 18, 19, 20, 25, 30];

export const TIGO_PAYMENT_DETAILS = {
  number: '0560260335',
  network: 'Tigo'
};