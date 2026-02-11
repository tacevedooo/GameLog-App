
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Experience } from '../types';
import { Loader2, Trash2, Edit3, Star, Clock, Calendar, X, Save } from 'lucide-react';

const MyExperiencesPage: React.FC<{ user: any }> = ({ user }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyExperiences();
  }, []);

  const fetchMyExperiences = async () => {
    try {
      const res = await api.getExperiences();
      // The API returns all, for a real app we'd filter by user id if not done by backend
      // But based on provided docs, user experiences can be fetched specifically:
      // However, /api/experience often returns for all in simple setups.
      // We filter manually here to ensure "My Plays" means "Mine"
      const filtered = res.filter((e: any) => {
          const userId = typeof e.user === 'object' ? e.user._id : e.user;
          return userId === user?.id;
      });
      setExperiences(filtered);
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
      alert('Error deleting');
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
      alert('Failed to update experience');
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
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">My Archive</h1>
        <p className="text-slate-400">Manage your logs and critical reviews.</p>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-slate-900/50 rounded-3xl border border-dashed border-white/10 p-20 text-center">
          <h2 className="text-xl font-bold text-slate-300">Clean Slate</h2>
          <p className="text-slate-500 mt-2">You haven't logged any games yet. Head to the library to start tracking!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-slate-900 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all shadow-xl group relative overflow-hidden">
              <div className="flex gap-6">
                <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/5">
                  <img 
                    src={typeof exp.game === 'object' ? exp.game.coverImage : ''} 
                    alt="Game" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/200/300'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-white truncate">
                      {typeof exp.game === 'object' ? exp.game.title : 'Game Title'}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5 text-yellow-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" /> {exp.rating}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {exp.hoursPlayed}h
                    </span>
                  </div>

                  <p className="mt-4 text-slate-300 text-sm italic line-clamp-2 leading-relaxed bg-white/5 p-3 rounded-lg">
                    "{exp.review}"
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1 uppercase tracking-widest font-black">
                      <Calendar className="w-3 h-3" /> {new Date(exp.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingExp(exp)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        title="Edit Log"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp._id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingExp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingExp(null)} />
          <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Edit Log</h2>
                <button onClick={() => setEditingExp(null)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Hours Played</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
                      value={editingExp.hoursPlayed}
                      onChange={e => setEditingExp({...editingExp, hoursPlayed: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Rating (0-10)</label>
                    <input 
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
                      value={editingExp.rating}
                      onChange={e => setEditingExp({...editingExp, rating: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Review</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
                    value={editingExp.review}
                    onChange={e => setEditingExp({...editingExp, review: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
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
