import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <Toaster position="top-right" richColors expand={false} />
          <RouterProvider router={router} />
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
