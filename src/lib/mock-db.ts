export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  pin: string;
  role: Role;
  balance: number;
  isWorking: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  price: number;
  emoji: string;
}

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', pin: '0000', role: 'admin', balance: 500.0, isWorking: false },
  { id: '2', name: 'Max Mustermann', pin: '1234', role: 'user', balance: 45.5, isWorking: false },
  { id: '3', name: 'Julia Keller', pin: '1111', role: 'user', balance: 12.0, isWorking: false },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'b1', name: 'Bier', stock: 48, minStock: 20, price: 3.0, emoji: '🍺' },
  { id: 'c1', name: 'Cola', stock: 5, minStock: 10, price: 2.5, emoji: '🥤' },
  { id: 'w1', name: 'Wasser', stock: 30, minStock: 15, price: 1.5, emoji: '💧' },
  { id: 'm1', name: 'Mate', stock: 12, minStock: 10, price: 3.5, emoji: '🧉' },
];