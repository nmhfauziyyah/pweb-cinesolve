import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: '',
    genres: '',
    country: '',
    year: '',
  });

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await axiosInstance.get(`/movies/${id}`);
      const movie = response.data;
      setFormData({
        title: movie.title,
        description: movie.description,
        poster: movie.poster,
        genres: movie.genres.join(', '),
        country: movie.country,
        year: movie.year.toString(),
      });
    } catch (error) {
      toast({ title: 'Failed to fetch movie', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.put(`/movies/${id}`, {
        ...formData,
        genres: formData.genres.split(',').map((g) => g.trim()),
        year: parseInt(formData.year),
      });
      
      toast({ title: 'Movie updated successfully' });
      navigate('/admin/movies');
    } catch (error) {
      toast({ title: 'Failed to update movie', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/movies')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="font-display text-4xl font-bold">Edit Movie</h1>

          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="rounded-xl min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poster">Poster URL</Label>
              <Input
                id="poster"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genres">Genres (comma-separated)</Label>
                <Input
                  id="genres"
                  value={formData.genres}
                  onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                  placeholder="Action, Drama, Thriller"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Release Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Movie'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditMovie;
