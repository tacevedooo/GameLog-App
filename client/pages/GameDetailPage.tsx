
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Game, Experience } from '../types';
import { Loader2, ArrowLeft, Clock, Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const GameDetailPage: React.FC = () => {
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

  if (loading || !game) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
            <img src={game.coverImage} alt={game.title} className="w-full object-cover aspect-[3/4]" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                {game.genre}
              </span>
              <span className="text-slate-500 text-sm">
                Released: {new Date(game.releaseDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight mb-4">{game.title}</h1>
            <div className="flex flex-wrap gap-2">
              {game.platform.map(p => (
                <span key={p} className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-xs font-medium border border-white/5">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-bold text-slate-200">About this game</h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              {game.description}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/5 shadow-inner">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Gamepad className="w-6 h-6 text-indigo-500" /> Log Your Experience
            </h2>
            
            <form onSubmit={handleLogExperience} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Hours Played
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.hoursPlayed}
                  onChange={(e) => setFormData({...formData, hoursPlayed: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Rating (0-10)
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" max="10" step="0.5"
                    className="flex-1 accent-indigo-500"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                  />
                  <span className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">
                    {formData.rating}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Your Review
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What did you think of the game?"
                  value={formData.review}
                  onChange={(e) => setFormData({...formData, review: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={submitting || success}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    success 
                    ? 'bg-green-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <><CheckCircle2 className="w-5 h-5" /> Saved!</>
                  ) : (
                    <><Send className="w-4 h-4" /> Log Playthrough</>
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
