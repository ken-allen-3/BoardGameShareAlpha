import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyGames from './pages/MyGames';
import BorrowGames from './pages/BorrowGames';
import Login from './pages/Login';
import Users from './pages/Users';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const isAdmin = currentUser?.email === 'kenny@springwavestudios.com';
  
  console.log('Admin check:', {
    currentUser: currentUser?.email,
    isAdmin,
    loading
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser || !isAdmin) {
    return <Navigate to="/my-games" />;
  }

  return <>{children}</>;
}

function App() {
  console.log('Firebase connection check - App loaded');
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="mx-auto max-w-full">
            <Navbar />
            <main className="px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/my-games" element={
                  <RequireAuth>
                    <MyGames />
                  </RequireAuth>
                } />
                <Route path="/borrow" element={
                  <RequireAuth>
                    <BorrowGames />
                  </RequireAuth>
                } />
                <Route path="/users" element={
                  <RequireAdmin>
                    <Users />
                  </RequireAdmin>
                } />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;