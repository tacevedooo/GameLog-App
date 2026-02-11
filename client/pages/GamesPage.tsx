
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game } from '../types';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader2, Star, Calendar, Gamepad } from 'lucide-react';

const GamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      <p className="text-slate-400 font-medium">Loading catalog...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Browse Games</h1>
          <p className="text-slate-400 mt-1">Discover new adventures to track</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search titles, genres..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.length > 0 ? filteredGames.map((game) => (
          <Link 
            key={game._id} 
            to={`/games/${game._id}`}
            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all hover:-translate-y-1"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={game.coverImage} 
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600'; }}
              />
              <div className="absolute inset-0 game-card-gradient flex flex-col justify-end p-5">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-indigo-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white">
                    {game.genre}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white line-clamp-1">{game.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-slate-300 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(game.releaseDate).getFullYear()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gamepad className="w-3 h-3" />
                    {game.platform[0]}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 text-lg">No games found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
