
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game } from '../types';
import { Plus, Trash2, Edit3, Loader2, X, Check } from 'lucide-react';

const AdminGamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    platform: [] as string[],
    releaseDate: '',
    coverImage: ''
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      platform: [],
      releaseDate: '',
      coverImage: ''
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateGame(editingId, formData);
      } else {
        await api.createGame(formData);
      }
      fetchGames();
      resetForm();
    } catch (err) {
      alert('Error saving game');
    }
  };

  const handleEdit = (game: Game) => {
    setEditingId(game._id);
    setFormData({
      title: game.title,
      description: game.description,
      genre: game.genre,
      platform: game.platform,
      releaseDate: game.releaseDate.split('T')[0],
      coverImage: game.coverImage
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this game permanently?')) return;
    try {
      await api.deleteGame(id);
      fetchGames();
    } catch (err) {
      alert('Error deleting game');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Database Management</h1>
          <p className="text-slate-400">Total: {games.length} titles registered</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Game
        </button>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Genre</th>
              <th className="px-6 py-4">Platforms</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {games.map(game => (
              <tr key={game._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={game.coverImage} className="w-8 h-10 object-cover rounded bg-slate-800" />
                    <span className="font-bold text-white">{game.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400">{game.genre}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {game.platform.map(p => (
                      <span key={p} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(game)}
                      className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(game._id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">{editingId ? 'Edit Game' : 'Register New Game'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Title</label>
                  <input 
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Genre</label>
                  <input 
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.genre}
                    onChange={e => setFormData({...formData, genre: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Release Date</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.releaseDate}
                    onChange={e => setFormData({...formData, releaseDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Cover Image URL</label>
                  <input 
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://..."
                    value={formData.coverImage}
                    onChange={e => setFormData({...formData, coverImage: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-400">Platforms (comma separated)</label>
                  <input 
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="PS5, Xbox, PC"
                    value={formData.platform.join(', ')}
                    onChange={e => setFormData({...formData, platform: e.target.value.split(',').map(s => s.trim())})}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-400">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all"
              >
                {editingId ? 'Save Changes' : 'Register Game'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGamesPage;
