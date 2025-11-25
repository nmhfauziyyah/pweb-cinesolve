import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';

const AdminMovies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get('/movies');
      console.log('Fetched movies:', response.data);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({ title: 'Failed to fetch movies', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      await axiosInstance.delete(`/movies/${id}`);
      toast({ title: 'Movie deleted successfully' });
      fetchMovies();
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Failed to delete movie', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => navigate('/admin/movies/add')}
            className="rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 space-y-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Manage Movies</h1>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-3 md:p-4 font-semibold">Title</th>
                  <th className="text-left p-3 md:p-4 font-semibold hidden sm:table-cell">Year</th>
                  <th className="text-left p-3 md:p-4 font-semibold hidden md:table-cell">Country</th>
                  <th className="text-left p-3 md:p-4 font-semibold hidden lg:table-cell">Genre</th>
                  <th className="text-right p-3 md:p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No movies found
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr key={movie.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 md:p-4 font-semibold line-clamp-1">{movie.title}</td>
                      <td className="p-3 md:p-4 hidden sm:table-cell">{movie.year || 'N/A'}</td>
                      <td className="p-3 md:p-4 hidden md:table-cell">{movie.country || 'N/A'}</td>
                      <td className="p-3 md:p-4 hidden lg:table-cell">{movie.genres?.join(', ') || 'N/A'}</td>
                      <td className="p-3 md:p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10"
                            onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10"
                            onClick={() => handleDelete(movie.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMovies;
