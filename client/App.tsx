
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import GamesPage from './pages/GamesPage';
import GameDetailPage from './pages/GameDetailPage';
import MyExperiencesPage from './pages/MyExperiencesPage';
import AdminGamesPage from './pages/AdminGamesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        // Simple manual JWT decode to get user info (role, id)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setUser(JSON.parse(jsonPayload));
      } catch (e) {
        console.error('Invalid token');
        handleLogout();
      }
    }
  }, [token]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/games" />} />
            <Route path="/games" element={token ? <GamesPage /> : <Navigate to="/login" />} />
            <Route path="/games/:id" element={token ? <GameDetailPage /> : <Navigate to="/login" />} />
            <Route path="/my-experiences" element={token ? <MyExperiencesPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminGamesPage /> : <Navigate to="/games" />} />
            <Route path="/login" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/games" />} />
            <Route path="/register" element={!token ? <RegisterPage onLogin={handleLogin} /> : <Navigate to="/games" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} GameLog. Build for gamers, by gamers.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
