import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import WalletPage from './pages/Wallet';
import AdminPage from './pages/Admin';
import AuthPage from './pages/Auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'user' | 'admin' }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute role="user">
                <WalletPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ProfileProvider>
          <Router>
            <AppContent />
          </Router>
        </ProfileProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;