
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Gamepad2, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const RegisterPage: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.register({ username, email, password });
      onLogin(res.token);
      navigate('/games');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-600/20">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the ultimate gaming community</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Username
            </label>
            <input 
              type="text"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="ProGamer99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input 
              type="email"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="gamer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input 
              type="password"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up Now'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
