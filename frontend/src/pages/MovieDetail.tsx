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

  // Map platform names to their image paths
  const platformIconMap: Record<string, string> = {
    'Netflix': '/netflix.png',
    'Disney+': '/disney.jpeg',
    'Prime Video': '/prime.png',
    'Viu': '/viu.png',
    'iQiyi': '/iqiyi.png',
    'Vidio': '/vidio.png',
    'WeTV': '/wetv.jpg',
  };

  // Helper function to get proper icon path
  const getProperIconPath = (platformName: string, platformIcon: string) => {
    // If platformIcon is already a valid image path (starts with /), use it
    if (platformIcon && platformIcon.startsWith('/')) {
      return platformIcon;
    }
    // Otherwise, look up by platform name
    return platformIconMap[platformName] || '/netflix.png';
  };

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
      // Transform reviews to match frontend expectations
      const transformedReviews = response.data.map((review: any) => ({
        ...review,
        id: review._id,
        userId: review.user_id?._id || review.user_id,
        userName: review.user_id?.name || 'Anonymous',
      }));
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await axiosInstance.post('/reviews', {
        film_id: id,
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

  const BASE_URL = 'http://localhost:3000'; 
  const getFullPosterUrl = (posterPath: string) => {
    if (posterPath && (posterPath.startsWith('http://') || posterPath.startsWith('https://'))) {
      return posterPath;
    } 
    if (posterPath) {
      return `${BASE_URL}/uploads/posters/${posterPath}`;
    }
    return '/placeholder.svg'; 
  };

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const heroImageUrl = getFullPosterUrl(movie.poster);

  return (
    <div className="min-h-screen">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 pb-12 space-y-12">
        {/* Movie Header with Poster Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Poster Card */}
            <div className="flex-shrink-0">
              <div className="w-40 md:w-48 h-60 md:h-72 rounded-2xl overflow-hidden shadow-lg border border-primary/20">
                <img
                  src={heroImageUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 space-y-4">
              <h1 className="font-display text-3xl md:text-5xl font-bold">{movie.title}</h1>
              
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

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {movie.description}
              </p>
            </div>
          </div>

          {/* Watch Sources */}
          {movie.watchSources && movie.watchSources.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold">Where to Watch</h3>
              <div className="flex flex-wrap gap-3">
                {movie.watchSources.map((source: any) => (
                  <a
                    key={source.platformName}
                    href={source.platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card px-4 py-2 rounded-lg hover-lift flex items-center gap-2 transition hover:bg-primary/10"
                  >
                    <img 
                      src={getProperIconPath(source.platformName, source.platformIcon)} 
                      alt={source.platformName} 
                      className="h-5 w-5"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = platformIconMap[source.platformName] || '/netflix.png';
                      }}
                    />
                    <span className="font-semibold">{source.platformName}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Reviews</h2>

          {/* Add Review */}
          <div className="glass-card p-4 md:p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-base md:text-lg">Write a Review</h3>
            
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
