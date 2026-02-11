
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game } from '../types';
import { Search, Loader2, Calendar, Gamepad, PlusCircle, Settings, X, Clock, Star, MessageSquare, Send, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

const GamesPage: React.FC<{ user: any }> = ({ user }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Log Experience state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    hoursPlayed: 0,
    rating: 5,
    review: ''
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.getGames();
      setGames(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) return;
    setSubmitting(true);
    try {
      await api.createExperience({
        game: selectedGame._id,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedGame(null);
      }, 1500);
    } catch (err) {
      alert('Error logging experience. You might have already logged this game.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this game?')) return;
    try {
      await api.deleteGame(gameId);
      setGames(prev => prev.filter(g => g._id !== gameId));
      setSelectedGame(null);
    } catch (err) {
      alert('Failed to delete game');
    }
  };

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      <p className="text-slate-400 font-medium">Loading Library...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">The Vault</h1>
          <p className="text-slate-400 mt-1">Select a game to view details and log your experience.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search library..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => window.location.hash = '#/admin'}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              <PlusCircle className="w-5 h-5" /> Create Game
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.length > 0 ? filteredGames.map((game) => (
          <div 
            key={game._id} 
            onClick={() => {
              setSelectedGame(game);
              setFormData({ hoursPlayed: 0, rating: 5, review: '' });
            }}
            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl hover:-translate-y-1"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={game.coverImage} 
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + game.title + '/400/600'; }}
              />
              <div className="absolute inset-0 game-card-gradient flex flex-col justify-end p-5">
                <h3 className="text-xl font-bold text-white leading-tight">{game.title}</h3>
                <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mt-1">{game.genre}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 text-lg">No games found.</p>
          </div>
        )}
      </div>

      {/* Game Detail Modal "Window" */}
      {selectedGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedGame(null)} />
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedGame(null)} 
              className="absolute top-6 right-6 z-10 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image & Quick Info Sidebar */}
              <div className="lg:col-span-4 bg-slate-800/20 p-8 lg:p-10 flex flex-col items-center border-r border-white/5">
                <img 
                  src={selectedGame.coverImage} 
                  className="w-full rounded-2xl shadow-2xl aspect-[3/4] object-cover mb-8 ring-1 ring-white/10" 
                  alt={selectedGame.title} 
                />
                <div className="w-full space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-3">Release Info</span>
                    <div className="flex items-center gap-3 text-white font-semibold">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      {new Date(selectedGame.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-3">Platforms</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedGame.platform.map(p => (
                        <span key={p} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Admin Actions in Modal */}
                  {user?.role === 'admin' && (
                    <div className="pt-6 border-t border-white/5 space-y-3">
                      <span className="text-[10px] uppercase tracking-widest font-black text-indigo-500 block">Admin Management</span>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => window.location.hash = '#/admin'}
                          className="w-full flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-400 py-3 rounded-xl font-bold border border-indigo-500/20 hover:bg-indigo-600/20 transition-all"
                        >
                          <Edit3 className="w-4 h-4" /> Edit Database Entry
                        </button>
                        <button 
                          onClick={() => handleDeleteGame(selectedGame._id)}
                          className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-400 py-3 rounded-xl font-bold border border-red-500/20 hover:bg-red-600/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Game
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content & Logging Area */}
              <div className="lg:col-span-8 p-8 lg:p-12 space-y-10">
                <div className="space-y-4">
                  <span className="bg-indigo-600/20 text-indigo-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20 inline-block">
                    {selectedGame.genre}
                  </span>
                  <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">{selectedGame.title}</h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Gamepad className="w-4 h-4" /> Game Synopsis
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedGame.description}
                  </p>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-inner">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-indigo-500" /> Log Your Playthrough
                  </h3>
                  <form onSubmit={handleLogExperience} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Hours Invested
                      </label>
                      <input 
                        type="number" step="0.1" required
                        className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.hoursPlayed}
                        onChange={(e) => setFormData({...formData, hoursPlayed: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex justify-between items-center">
                        Your Score <span className="text-indigo-400 font-black">{formData.rating}/10</span>
                      </label>
                      <div className="flex items-center gap-4 pt-3">
                        <input 
                          type="range" min="0" max="10" step="0.5"
                          className="w-full accent-indigo-500 cursor-pointer"
                          value={formData.rating}
                          onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public Review</label>
                      <textarea 
                        rows={4}
                        placeholder="What are your thoughts on this title?"
                        className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                        value={formData.review}
                        onChange={(e) => setFormData({...formData, review: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={submitting || success}
                      className={`sm:col-span-2 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                        success ? 'bg-green-600 shadow-green-500/20 shadow-lg' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30'
                      } text-white`}
                    >
                      {submitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : success ? (
                        <><CheckCircle2 className="w-6 h-6" /> Play Logged Successfully!</>
                      ) : (
                        <><Send className="w-5 h-5" /> Add to My Plays</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesPage;
