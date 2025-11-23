import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Film, Search, LogOut, User, TrendingUp, Heart, Smile, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import MovieCard from '@/components/MovieCard';
import DarkModeToggle from '@/components/DarkModeToggle';
import axiosInstance from '@/lib/axios';

const UserHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const moods = [
    { icon: Heart, label: 'Romantic', color: 'text-pink-500' },
    { icon: Zap, label: 'Action', color: 'text-red-500' },
    { icon: Smile, label: 'Comedy', color: 'text-yellow-500' },
    { icon: TrendingUp, label: 'Thriller', color: 'text-purple-500' },
  ];

  useEffect(() => {
    fetchMovies();
    fetchTrending();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get('/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await axiosInstance.get('/movies/trending');
      setTrendingMovies(response.data);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-bold">CineSolve</span>
          </div>
          
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              className="rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-12">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            What's your mood today?
          </p>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className="glass-card p-6 rounded-2xl hover-lift text-left group"
            >
              <mood.icon className={`h-8 w-8 mb-3 ${mood.color} transition-smooth group-hover:scale-110`} />
              <p className="font-semibold">{mood.label}</p>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="kr">South Korea</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trending Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="font-display text-3xl font-bold">Trending Now</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.length > 0 ? (
              trendingMovies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No trending movies available
              </p>
            )}
          </div>
        </section>

        {/* All Movies */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold">Browse All</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.length > 0 ? (
              movies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No movies found
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserHome;
