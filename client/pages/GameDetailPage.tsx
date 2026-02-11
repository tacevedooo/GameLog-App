
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Game } from '../types';
import { Loader2, ArrowLeft, Clock, Star, MessageSquare, Send, CheckCircle2, Trash2, Edit } from 'lucide-react';

const GameDetailPage: React.FC<{ user: any }> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    hoursPlayed: 0,
    rating: 5,
    review: ''
  });

  useEffect(() => {
    if (id) fetchGame(id);
  }, [id]);

  const fetchGame = async (gameId: string) => {
    try {
      const response = await api.getGameById(gameId);
      setGame(response.data);
    } catch (err) {
      console.error(err);
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const handleLogExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game) return;
    setSubmitting(true);
    try {
      await api.createExperience({
        game: game._id,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/my-experiences');
      }, 2000);
    } catch (err) {
      alert('Error logging experience. You might have already logged this game.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGame = async () => {
    if (!game || !window.confirm('Delete this game from the database permanently?')) return;
    try {
      await api.deleteGame(game._id);
      navigate('/games');
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading || !game) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Library
        </button>
        
        {user?.role === 'admin' && (
          <div className="flex gap-3">
             <button 
              onClick={() => navigate('/admin')} // Simple way to reuse admin panel for editing
              className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-xl font-bold border border-indigo-500/20 hover:bg-indigo-600/20 transition-all"
            >
              <Edit className="w-4 h-4" /> Manage
            </button>
            <button 
              onClick={handleDeleteGame}
              className="flex items-center gap-2 bg-red-600/10 text-red-400 px-4 py-2 rounded-xl font-bold border border-red-500/20 hover:bg-red-600/20 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Wipe Game
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-white/5">
            <img src={game.coverImage} alt={game.title} className="w-full object-cover aspect-[3/4]" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
                {game.genre}
              </span>
              <span className="text-slate-500 text-sm font-medium">
                Premiered: {new Date(game.releaseDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-6xl font-black text-white leading-none mb-6 tracking-tighter">{game.title}</h1>
            <div className="flex flex-wrap gap-2">
              {game.platform.map(p => (
                <span key={p} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold border border-white/5">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-black text-white mb-4 uppercase tracking-widest text-xs opacity-50">Synopsis</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              {game.description}
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              Add to My Plays
            </h2>
            
            <form onSubmit={handleLogExperience} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Playtime (Hours)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                    value={formData.hoursPlayed}
                    onChange={(e) => setFormData({...formData, hoursPlayed: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex justify-between">
                  Rating <span>{formData.rating}/10</span>
                </label>
                <div className="flex items-center gap-4 py-2">
                  <input 
                    type="range" 
                    min="0" max="10" step="0.5"
                    className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Public Review</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-800 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder="Share your thoughts with the community..."
                  value={formData.review}
                  onChange={(e) => setFormData({...formData, review: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={submitting || success}
                  className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                    success 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30'
                  }`}
                >
                  {submitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : success ? (
                    <><CheckCircle2 className="w-6 h-6" /> Play Logged!</>
                  ) : (
                    <><Send className="w-5 h-5" /> Submit Experience</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
