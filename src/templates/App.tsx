import { useEffect, ReactNode } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import useAppStore from '../store.js';

// Import pages
import Home from './pages/Home.js';
import NotFound from './pages/NotFound.js';

// Define the type for your app store
interface AppStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Placeholder components for missing pages
const Login = () => <div className="p-4">Login Page</div>;
const Register = () => <div className="p-4">Register Page</div>;
const Dashboard = () => <div className="p-4">Dashboard Page</div>;
const Account = () => <div className="p-4">Account Page</div>;
const Payments = () => <div className="p-4">Payments Page</div>;

// Mock auth hook - will be replaced with real implementation
const useAuth = () => {
  return {
    user: null,
    loading: false
  };
};

// Protected route component with proper typing
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const { darkMode } = useAppStore() as AppStore;
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}