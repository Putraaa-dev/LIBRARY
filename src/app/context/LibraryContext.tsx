import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Book, User, Loan, LoanStatus } from '../types';
import { DEFAULT_BOOKS, DEFAULT_USERS, DEFAULT_LOANS } from '../data/mockData';

interface LibraryContextType {
  books: Book[];
  users: User[];
  loans: Loan[];
  // Books
  addBook: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  updateBook: (id: string, data: Partial<Book>) => void;
  deleteBook: (id: string) => boolean;
  // Users
  addUser: (user: Omit<User, 'id' | 'memberSince' | 'totalLoans'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => boolean;
  // Loans
  requestLoan: (userId: string, userName: string, userEmail: string, bookId: string) => { success: boolean; message: string };
  approveLoan: (loanId: string) => void;
  rejectLoan: (loanId: string, notes?: string) => void;
  returnLoan: (loanId: string) => void;
  getUserLoans: (userId: string) => Loan[];
}

const LibraryContext = createContext<LibraryContextType | null>(null);

const BOOKS_KEY = 'perpus_books';
const USERS_KEY = 'perpus_users';
const LOANS_KEY = 'perpus_loans';

function loadFromStorage<T>(key: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaults;
  } catch {
    return defaults;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => {
    const stored = localStorage.getItem(BOOKS_KEY);
    if (!stored) { localStorage.setItem(BOOKS_KEY, JSON.stringify(DEFAULT_BOOKS)); return DEFAULT_BOOKS; }
    try { return JSON.parse(stored); } catch { return DEFAULT_BOOKS; }
  });
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) { localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS)); return DEFAULT_USERS; }
    try { return JSON.parse(stored); } catch { return DEFAULT_USERS; }
  });
  const [loans, setLoans] = useState<Loan[]>(() => {
    const stored = localStorage.getItem(LOANS_KEY);
    if (!stored) { localStorage.setItem(LOANS_KEY, JSON.stringify(DEFAULT_LOANS)); return DEFAULT_LOANS; }
    try { return JSON.parse(stored); } catch { return DEFAULT_LOANS; }
  });

  useEffect(() => {
    // Sync any missing defaults
    if (!localStorage.getItem(BOOKS_KEY)) localStorage.setItem(BOOKS_KEY, JSON.stringify(DEFAULT_BOOKS));
    if (!localStorage.getItem(USERS_KEY)) localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    if (!localStorage.getItem(LOANS_KEY)) localStorage.setItem(LOANS_KEY, JSON.stringify(DEFAULT_LOANS));
  }, []);

  // ---- BOOKS ----
  const addBook = useCallback((book: Omit<Book, 'id' | 'addedAt'>) => {
    const newBook: Book = { ...book, id: `b${Date.now()}`, addedAt: new Date().toISOString().split('T')[0] };
    setBooks(prev => {
      const updated = [...prev, newBook];
      saveToStorage(BOOKS_KEY, updated);
      return updated;
    });
  }, []);

  const updateBook = useCallback((id: string, data: Partial<Book>) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...data } : b);
      saveToStorage(BOOKS_KEY, updated);
      return updated;
    });
  }, []);

  const deleteBook = useCallback((id: string): boolean => {
    const activeLoans = loadFromStorage<Loan>(LOANS_KEY, DEFAULT_LOANS)
      .filter(l => l.bookId === id && (l.status === 'approved' || l.status === 'pending'));
    if (activeLoans.length > 0) return false;
    setBooks(prev => {
      const updated = prev.filter(b => b.id !== id);
      saveToStorage(BOOKS_KEY, updated);
      return updated;
    });
    return true;
  }, []);

  // ---- USERS ----
  const addUser = useCallback((user: Omit<User, 'id' | 'memberSince' | 'totalLoans'>) => {
    const newUser: User = { ...user, id: `u${Date.now()}`, memberSince: new Date().toISOString().split('T')[0], totalLoans: 0 };
    setUsers(prev => {
      const updated = [...prev, newUser];
      saveToStorage(USERS_KEY, updated);
      return updated;
    });
  }, []);

  const updateUser = useCallback((id: string, data: Partial<User>) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...data } : u);
      saveToStorage(USERS_KEY, updated);
      return updated;
    });
  }, []);

  const deleteUser = useCallback((id: string): boolean => {
    const activeLoans = loadFromStorage<Loan>(LOANS_KEY, DEFAULT_LOANS)
      .filter(l => l.userId === id && (l.status === 'approved' || l.status === 'pending'));
    if (activeLoans.length > 0) return false;
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== id);
      saveToStorage(USERS_KEY, updated);
      return updated;
    });
    return true;
  }, []);

  // ---- LOANS ----
  const requestLoan = useCallback((userId: string, userName: string, userEmail: string, bookId: string): { success: boolean; message: string } => {
    const currentLoans = loadFromStorage<Loan>(LOANS_KEY, DEFAULT_LOANS);
    const currentBooks = loadFromStorage<Book>(BOOKS_KEY, DEFAULT_BOOKS);
    const book = currentBooks.find(b => b.id === bookId);
    if (!book) return { success: false, message: 'Buku tidak ditemukan.' };
    if (book.available <= 0) return { success: false, message: 'Buku tidak tersedia.' };
    const existing = currentLoans.find(l => l.userId === userId && l.bookId === bookId && (l.status === 'pending' || l.status === 'approved'));
    if (existing) return { success: false, message: 'Anda sudah meminjam atau mengajukan buku ini.' };
    const newLoan: Loan = {
      id: `l${Date.now()}`,
      userId, userName, userEmail, bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCategory: book.category,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    const updatedLoans = [...currentLoans, newLoan];
    setLoans(updatedLoans);
    saveToStorage(LOANS_KEY, updatedLoans);
    return { success: true, message: 'Pengajuan peminjaman berhasil! Menunggu persetujuan petugas.' };
  }, []);

  const approveLoan = useCallback((loanId: string) => {
    const approvedDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setLoans(prev => {
      const loan = prev.find(l => l.id === loanId);
      if (loan) {
        // Reduce available count
        setBooks(bPrev => {
          const updated = bPrev.map(b => b.id === loan.bookId ? { ...b, available: Math.max(0, b.available - 1) } : b);
          saveToStorage(BOOKS_KEY, updated);
          return updated;
        });
      }
      const updated = prev.map(l => l.id === loanId ? { ...l, status: 'approved' as LoanStatus, approvedDate, dueDate } : l);
      saveToStorage(LOANS_KEY, updated);
      return updated;
    });
  }, []);

  const rejectLoan = useCallback((loanId: string, notes?: string) => {
    setLoans(prev => {
      const updated = prev.map(l => l.id === loanId ? { ...l, status: 'rejected' as LoanStatus, notes: notes || 'Ditolak oleh petugas' } : l);
      saveToStorage(LOANS_KEY, updated);
      return updated;
    });
  }, []);

  const returnLoan = useCallback((loanId: string) => {
    const returnDate = new Date().toISOString().split('T')[0];
    setLoans(prev => {
      const loan = prev.find(l => l.id === loanId);
      if (loan) {
        // Increase available count
        setBooks(bPrev => {
          const updated = bPrev.map(b => b.id === loan.bookId ? { ...b, available: b.available + 1 } : b);
          saveToStorage(BOOKS_KEY, updated);
          return updated;
        });
        // Increment user totalLoans
        setUsers(uPrev => {
          const updated = uPrev.map(u => u.id === loan.userId ? { ...u, totalLoans: u.totalLoans + 1 } : u);
          saveToStorage(USERS_KEY, updated);
          return updated;
        });
      }
      const updated = prev.map(l => l.id === loanId ? { ...l, status: 'returned' as LoanStatus, returnDate } : l);
      saveToStorage(LOANS_KEY, updated);
      return updated;
    });
  }, []);

  const getUserLoans = useCallback((userId: string): Loan[] => {
    return loans.filter(l => l.userId === userId);
  }, [loans]);

  return (
    <LibraryContext.Provider value={{ books, users, loans, addBook, updateBook, deleteBook, addUser, updateUser, deleteUser, requestLoan, approveLoan, rejectLoan, returnLoan, getUserLoans }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}