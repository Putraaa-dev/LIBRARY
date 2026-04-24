import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { BooksPage } from './pages/BooksPage';
import { UsersPage } from './pages/UsersPage';
import { LoansPage } from './pages/LoansPage';
import { ProfilePage } from './pages/ProfilePage';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <p className="text-slate-400 mb-4" style={{ fontSize: '5rem', lineHeight: 1 }}>📚</p>
        <h1 className="text-slate-700 dark:text-slate-300 mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm" style={{ fontWeight: 500 }}>
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'loans', element: <LoansPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
