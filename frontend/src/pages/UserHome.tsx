import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Film, Search, LogOut, User, TrendingUp, Heart, Zap, Smile, AlertTriangle, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MovieCard from '@/components/MovieCard';
import DarkModeToggle from '@/components/DarkModeToggle';
import axiosInstance from '@/lib/axios';

interface Genre {
  _id: string;
  name: string;
  icon?: string;
}

interface Country {
  _id: string;
  name: string;
  flag?: string;
}

interface Mood {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  genres: string[]; // Genre names yang sesuai dengan mood ini
}

const UserHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [carouselPosition, setCarouselPosition] = useState(0);

  // Mood to genres mapping
  const moods: Mood[] = [
    { 
      id: 'romantic', 
      icon: Heart, 
      label: 'Fun & Light', 
      color: 'text-pink-500',
      genres: ['Comedy','Romance', 'Adventure', 'Fantasy']
    },
    { 
      id: 'action', 
      icon: Zap, 
      label: 'Excited & Energetic', 
      color: 'text-red-500',
      genres: ['Action', 'Sci-Fi','Thriller', 'Adventure']
    },
    { 
      id: 'thrilling', 
      icon: AlertTriangle, 
      label: 'Dark & Intense', 
      color: 'text-yellow-500',
      genres: ['Horror', 'Thriller', 'Mystery', 'Drama']
    },
    { 
      id: 'comedy', 
      icon: Smile, 
      label: 'Emotional & Thoughtful', 
      color: 'text-purple-500',
      genres: ['Drama', 'Mystery', 'Romance', 'Fantasy']
    },
  ];

  useEffect(() => {
    fetchMovies();
    fetchTrending();
    fetchGenres();
    fetchCountries();
  }, []);

  // Filter movies whenever search, genre, country, or mood changes
  useEffect(() => {
    let filtered = movies;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Mood filter (has priority over genre)
    if (selectedMood) {
      const mood = moods.find(m => m.id === selectedMood);
      if (mood) {
        filtered = filtered.filter(m =>
          m.genre?.some((g: string) => mood.genres.includes(g))
        );
      }
    } else if (selectedGenre !== 'all') {
      // Genre filter (only if mood is not selected)
      filtered = filtered.filter(m => 
        m.genre?.includes(selectedGenre)
      );
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(m => 
        m.country === selectedCountry
      );
    }

    setFilteredMovies(filtered);
  }, [movies, searchQuery, selectedGenre, selectedCountry, selectedMood]);

  const fetchMovies = async () => {
    try {
      console.log('🎬 Fetching movies...');
      const response = await axiosInstance.get('/movies');
      console.log('✅ Movies fetched:', response.data);
      setMovies(response.data);
    } catch (error) {
      console.error('❌ Error fetching movies:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      console.log('🔥 Fetching trending...');
      const response = await axiosInstance.get('/movies/trending');
      console.log('✅ Trending fetched:', response.data);
      setTrendingMovies(response.data);
    } catch (error) {
      console.error('❌ Error fetching trending:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axiosInstance.get('/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axiosInstance.get('/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedGenre('all');
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Film className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-bold">CineSolve</span>
          </button>
          
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/bookmarks')}
              className="rounded-full"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
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
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(isSelected ? null : mood.id)}
                className={`p-6 rounded-2xl hover-lift transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'glass-card text-left group'
                }`}
              >
                <Icon className={`h-8 w-8 mb-3 ${!isSelected ? mood.color : ''} transition-smooth group-hover:scale-110`} />
                <p className="font-semibold">{mood.label}</p>
              </button>
            );
          })}
        </div>

        {/* Show related genres when mood is selected */}
        {selectedMood && (
          <div className="glass-card p-4 rounded-2xl">
            <p className="text-sm font-medium text-muted-foreground">
              Showing movies in: <span className="text-foreground font-semibold">
                {moods.find(m => m.id === selectedMood)?.genres.join(', ')}
              </span>
            </p>
          </div>
        )}

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
                {countries.map((country) => (
                  <SelectItem key={country._id} value={country.name}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={(value) => {
              setSelectedGenre(value);
              setSelectedMood(null); // Clear mood when manually selecting genre
            }}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre._id} value={genre.name}>
                    {genre.icon} {genre.name}
                  </SelectItem>
                ))}
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
          
          <div className="relative group">
            <div className="overflow-hidden">
              <div 
                className="flex transition-all duration-500 ease-out"
                style={{ transform: `translateX(calc(-${carouselPosition * 20}% - ${carouselPosition * 12}px))` }}
              >
                {trendingMovies.length > 0 ? (
                  trendingMovies.map((movie: any, index: number) => (
                    <div key={movie._id} className="flex-shrink-0 w-1/5 px-3">
                      <div className="relative">
                        <MovieCard movie={movie} />
                        {/* Ranking Number */}
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-20">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8 w-full">
                    No trending movies available
                  </p>
                )}
              </div>
            </div>

            {/* Left Arrow */}
            {carouselPosition > 0 && (
              <button
                onClick={() => setCarouselPosition(Math.max(0, carouselPosition - 1))}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-primary rounded-full p-2 hover:bg-primary/90 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-primary-foreground" />
              </button>
            )}

            {/* Right Arrow - only show if can scroll more */}
            {trendingMovies.length > 5 && carouselPosition < trendingMovies.length - 5 && (
              <button
                onClick={() => setCarouselPosition(carouselPosition + 1)}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-primary rounded-full p-2 hover:bg-primary/90 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-primary-foreground" />
              </button>
            )}
          </div>
        </section>

        {/* All Movies */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold">
            {selectedMood 
              ? `${moods.find(m => m.id === selectedMood)?.label} Movies` 
              : searchQuery 
                ? `Search results for "${searchQuery}"` 
                : 'Browse All'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie: any) => (
                <MovieCard key={movie._id} movie={movie} />
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
