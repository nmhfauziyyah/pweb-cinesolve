import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Star, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, description: '' });

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axiosInstance.get(`/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/reviews/movie/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await axiosInstance.post('/reviews', {
        movieId: id,
        rating: newReview.rating,
        description: newReview.description,
      });
      toast({ title: 'Review submitted!' });
      setNewReview({ rating: 5, description: '' });
      fetchReviews();
    } catch (error) {
      toast({ title: 'Failed to submit review', variant: 'destructive' });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast({ title: 'Review deleted' });
      fetchReviews();
    } catch (error) {
      toast({ title: 'Failed to delete review', variant: 'destructive' });
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <main className="container mx-auto px-6 -mt-32 relative z-10 pb-12 space-y-12">
        {/* Movie Info */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="space-y-4">
            <h1 className="font-display text-5xl font-bold">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {movie.year}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {movie.country}
              </Badge>
              {movie.genres?.map((genre: string) => (
                <Badge key={genre} variant="outline" className="text-sm px-3 py-1">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {movie.description}
          </p>

          {movie.watchSources && movie.watchSources.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold">Watch On</h3>
              <div className="flex gap-4">
                {movie.watchSources.map((source: any) => (
                  <a
                    key={source.id}
                    href={source.platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-4 rounded-xl hover-lift flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{source.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold">Reviews</h2>

          {/* Add Review */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-lg">Write a Review</h3>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="transition-smooth hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= newReview.rating
                        ? 'fill-gold text-gold'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Share your thoughts..."
              value={newReview.description}
              onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
              className="rounded-xl min-h-[100px]"
            />

            <Button onClick={handleSubmitReview} className="rounded-xl">
              Submit Review
            </Button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="glass-card p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{review.userName}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-gold text-gold'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {user?.id === review.userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-muted-foreground">{review.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MovieDetail;
