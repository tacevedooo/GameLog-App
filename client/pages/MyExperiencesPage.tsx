
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Experience } from '../types';
import { Loader2, Trash2, Edit3, Star, Clock, Gamepad, Calendar } from 'lucide-react';

const MyExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyExperiences();
  }, []);

  const fetchMyExperiences = async () => {
    try {
      // Assuming we can get all and filter or the backend has /user/:id
      // For this demo, we'll fetch all experiences and rely on backend to filter if needed
      // or if it returns all, we can filter by the logged-in user in a real app.
      const res = await api.getExperiences();
      setExperiences(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.deleteExperience(id);
      setExperiences(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Error deleting');
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
        <h1 className="text-4xl font-extrabold text-white">My Gaming Journey</h1>
        <p className="text-slate-400">Your collection of memories and critical takes.</p>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-slate-900/50 rounded-3xl border border-dashed border-white/10 p-20 text-center">
          <Gamepad className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-300">No logs yet</h2>
          <p className="text-slate-500 mt-2">Start by browsing the game catalog and adding your plays.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-slate-900 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all shadow-xl group">
              <div className="flex gap-6">
                <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/5">
                  <img 
                    src={typeof exp.game === 'object' ? exp.game.coverImage : ''} 
                    alt="Game" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/100/150'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-white truncate">
                      {typeof exp.game === 'object' ? exp.game.title : 'Unknown Game'}
                    </h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(exp._id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/10">
                      <Star className="w-3.5 h-3.5 fill-indigo-400" /> {exp.rating}/10
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {exp.hoursPlayed}h
                    </span>
                  </div>

                  <p className="mt-4 text-slate-300 text-sm italic line-clamp-2 leading-relaxed">
                    "{exp.review}"
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1 uppercase tracking-widest font-bold">
                      <Calendar className="w-3 h-3" /> {new Date(exp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExperiencesPage;
