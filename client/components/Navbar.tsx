
import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, LogOut, LayoutDashboard, Bookmark, Globe, User } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 transition-colors">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-white">GAMELOG</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/games" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                <Bookmark className="w-4 h-4" /> Games
              </Link>
              <Link to="/my-experiences" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                <LayoutDashboard className="w-4 h-4" /> My Plays
              </Link>
              <Link to="/community" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4" /> Community
              </Link>
            </div>
            
            {/* User Identity Section */}
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-3 select-none">
                <span className="text-sm font-black text-white tracking-tight truncate max-w-[150px]">
                  {user.username}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              
              <button 
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl transition-all group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2">Login</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2 rounded-lg transition-all">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
