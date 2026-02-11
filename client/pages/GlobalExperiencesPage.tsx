
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Experience } from '../types';
import { Loader2, Globe, Star, Clock, MessageSquare, X, User as UserIcon } from 'lucide-react';

const GlobalExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await api.getExperiences();
      setExperiences(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
          <Globe className="w-8 h-8 text-indigo-500" /> Community Feed
        </h1>
        <p className="text-slate-400">See what the world is playing right now.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <div 
            key={exp._id} 
            onClick={() => setSelectedExp(exp)}
            className="bg-slate-900/50 rounded-2xl border border-white/5 p-5 cursor-pointer hover:bg-slate-900 hover:border-indigo-500/30 transition-all group"
          >
            <div className="flex gap-4">
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={typeof exp.game === 'object' ? exp.game.coverImage : ''} 
                  className="w-full h-full object-cover" 
                  alt="Game" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate">
                  {typeof exp.game === 'object' ? exp.game.title : 'Unknown'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> 
                    {typeof exp.user === 'object' ? exp.user.username : 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center text-yellow-500 text-xs font-bold">
                    <Star className="w-3 h-3 fill-yellow-500 mr-1" /> {exp.rating}
                  </div>
                  <div className="text-slate-500 text-xs font-medium">
                    {exp.hoursPlayed}h
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-slate-400 text-sm line-clamp-3 italic leading-relaxed">
              "{exp.review}"
            </p>
          </div>
        ))}
      </div>

      {selectedExp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedExp(null)} />
          <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedExp(null)} 
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-10 space-y-6">
              <div className="flex items-center gap-6">
                 <img 
                  src={typeof selectedExp.game === 'object' ? selectedExp.game.coverImage : ''} 
                  className="w-24 h-32 rounded-xl object-cover shadow-lg" 
                  alt="Game" 
                />
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {typeof selectedExp.game === 'object' ? selectedExp.game.title : 'Game Info'}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <UserIcon className="w-3 h-3" /> {typeof selectedExp.user === 'object' ? selectedExp.user.username : 'User'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest block mb-1">Final Score</span>
                  <div className="text-2xl font-black text-yellow-500 flex items-center justify-center gap-1">
                    <Star className="w-6 h-6 fill-yellow-500" /> {selectedExp.rating}/10
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest block mb-1">Time Invested</span>
                  <div className="text-2xl font-black text-white flex items-center justify-center gap-2">
                    <Clock className="w-6 h-6 text-indigo-500" /> {selectedExp.hoursPlayed}h
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Full Review
                </span>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 italic text-slate-200 leading-relaxed">
                  "{selectedExp.review}"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalExperiencesPage;
