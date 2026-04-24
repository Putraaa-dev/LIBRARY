import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BookOpen } from 'lucide-react';

export function AppLayout() {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const { loans } = useLibrary();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Open sidebar by default on large screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setSidebarOpen(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <BookOpen size={28} className="text-white" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Memuat perpustakaan...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const pendingCount = loans.filter(l => l.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={currentUser!.role}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pendingCount={pendingCount}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
