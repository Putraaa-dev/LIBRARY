export type UserRole = 'admin' | 'petugas' | 'user';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'returned';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  memberSince: string;
  status: UserStatus;
  avatar?: string;
  totalLoans: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: number;
  stock: number;
  available: number;
  cover?: string;
  description: string;
  pages: number;
  language: string;
  addedAt: string;
  rating: number;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  requestDate: string;
  approvedDate?: string;
  dueDate?: string;
  returnDate?: string;
  status: LoanStatus;
  notes?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  memberSince: string;
  status: UserStatus;
  avatar?: string;
  totalLoans: number;
}
