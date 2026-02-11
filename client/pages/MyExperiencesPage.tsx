
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Experience, Game } from '../types';
import { Loader2, Trash2, Edit3, Star, Clock, Calendar, X, Save, Plus, Gamepad, MessageSquarePlus } from 'lucide-react';

const MyExperiencesPage: React.FC<{ user: any }> = ({ user }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newExp, setNewExp] = useState({
    game: '',
    hoursPlayed: 0,
    rating: 5,
    review: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, gamesRes] = await Promise.all([
        api.getExperiences(),
        api.getGames()
      ]);
      
      const filtered = expRes.filter((e: any) => {
          const userId = typeof e.user === 'object' ? e.user._id : e.user;
          return userId === user?.id;
      });
      setExperiences(filtered);
      setGames(gamesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this log?')) return;
    try {
      await api.deleteExperience(id);
      setExperiences(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);
    try {
      await api.updateExperience(editingExp._id, {
        hoursPlayed: editingExp.hoursPlayed,
        rating: editingExp.rating,
        review: editingExp.review
      });
      setExperiences(prev => prev.map(ex => ex._id === editingExp._id ? editingExp : ex));
      setEditingExp(null);
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.game) return alert('Please select a game to review.');
    setSaving(true);
    try {
      await api.createExperience(newExp);
      await fetchData(); 
      setIsCreating(false);
      setNewExp({ game: '', hoursPlayed: 0, rating: 5, review: '' });
    } catch (err) {
      alert('Error creating log. You might already have a review for this title.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">My Archive</h1>
          <p className="text-slate-400 mt-1">Manage your history and community reviews.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquarePlus className="w-6 h-6" /> Create Review
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-slate-900/50 rounded-[40px] border-2 border-dashed border-white/5 p-24 text-center">
          <Gamepad className="w-20 h-20 text-slate-800 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-300">Your Archive is Empty</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Start building your gaming legacy by logging your first experience!</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="mt-8 text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" /> Start Logging Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-slate-900 rounded-[32px] p-8 border border-white/5 hover:border-indigo-500/20 transition-all shadow-2xl group overflow-hidden relative">
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-full sm:w-32 h-44 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 ring-1 ring-white/5">
                  <img 
                    src={typeof exp.game === 'object' ? exp.game.coverImage : ''} 
                    alt="Game Cover" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/300/400'; }}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white truncate mb-2">
                      {typeof exp.game === 'object' ? exp.game.title : 'Deleted Title'}
                    </h3>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Star className="w-5 h-5 fill-yellow-500" />
                        <span className="font-black text-lg">{exp.rating}</span>
                        <span className="text-slate-600 font-bold text-xs uppercase tracking-tighter">/10</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold">{exp.hoursPlayed}h</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 italic text-slate-400 text-sm leading-relaxed mb-6">
                      "{exp.review}"
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-600 font-black flex items-center gap-2 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(exp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingExp(exp)} 
                        className="p-3 bg-white/5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-indigo-500/10 transition-all"
                        title="Edit Review"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp._id)} 
                        className="p-3 bg-white/5 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
                        title="Delete Review"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE REVIEW MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsCreating(false)} />
          <div className="relative w-full max-w-xl bg-slate-900 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white tracking-tighter">Create New Review</h2>
                <button onClick={() => setIsCreating(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Game</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 appearance-none shadow-inner"
                      value={newExp.game}
                      onChange={e => setNewExp({...newExp, game: e.target.value})}
                    >
                      <option value="">Select from library...</option>
                      {games.map(g => <option key={g._id} value={g._id}>{g.title}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 font-bold">▼</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Playtime (h)</label>
                    <input type="number" step="0.1" required className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner" value={newExp.hoursPlayed} onChange={e => setNewExp({...newExp, hoursPlayed: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rating (0-10)</label>
                    <input type="number" step="0.5" min="0" max="10" required className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner" value={newExp.rating} onChange={e => setNewExp({...newExp, rating: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Review Content</label>
                  <textarea rows={4} required placeholder="Tell us about your journey..." className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner" value={newExp.review} onChange={e => setNewExp({...newExp, review: e.target.value})} />
                </div>
                <button type="submit" disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-600/30">
                  {saving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Log Final Experience'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT REVIEW MODAL */}
      {editingExp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setEditingExp(null)} />
          <div className="relative w-full max-w-lg bg-slate-900 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white tracking-tighter">Edit Review</h2>
                <button onClick={() => setEditingExp(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hours</label>
                    <input type="number" step="0.1" className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold" value={editingExp.hoursPlayed} onChange={e => setEditingExp({...editingExp, hoursPlayed: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rating</label>
                    <input type="number" step="0.5" className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold" value={editingExp.rating} onChange={e => setEditingExp({...editingExp, rating: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Review</label>
                  <textarea rows={4} className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-white resize-none" value={editingExp.review} onChange={e => setEditingExp({...editingExp, review: e.target.value})} />
                </div>
                <button type="submit" disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-600/30">
                  {saving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Apply Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyExperiencesPage;
