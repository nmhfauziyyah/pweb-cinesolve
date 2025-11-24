import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Film, LogOut, User, ArrowLeft, Bookmark } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import DarkModeToggle from '@/components/DarkModeToggle';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

const Bookmarks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/movies/bookmarks/list');
      setBookmarkedMovies(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/home');
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

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Back & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary fill-primary" />
            <h1 className="font-display text-4xl font-bold">My Bookmarks</h1>
          </div>
        </div>

        {/* Bookmarked Movies Grid */}
        <section className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
          ) : bookmarkedMovies.length > 0 ? (
            <>
              <p className="text-muted-foreground">
                {bookmarkedMovies.length} movie{bookmarkedMovies.length !== 1 ? 's' : ''} bookmarked
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {bookmarkedMovies.map((movie: any) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </>
          ) : (
            <div className="glass-card p-12 rounded-2xl text-center space-y-4">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <p className="text-xl text-muted-foreground">No bookmarks yet</p>
              <p className="text-sm text-muted-foreground">
                Start bookmarking movies to save them for later!
              </p>
              <Button 
                onClick={() => navigate('/home')}
                className="mt-4"
              >
                Browse Movies
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Bookmarks;
