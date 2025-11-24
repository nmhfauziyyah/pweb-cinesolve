import { Bookmark, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axios';

interface Movie {
  _id: string;
  title: string;
  poster: string;
  country: string;
  genre?: string[];
  genres?: string[];
  releaseYear?: number;
  year?: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await axiosInstance.delete(`/movies/${movie._id}/bookmark`);
      } else {
        await axiosInstance.post(`/movies/${movie._id}/bookmark`);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group relative glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
      </div>
      
      {/* Always visible info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 space-y-2">
        <h3 className="font-display text-lg font-bold text-white line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="text-xs bg-primary text-primary-foreground">
            {movie.country}
          </Badge>
          {(movie.genre || movie.genres || []).slice(0, 2).map((g) => (
            <Badge key={g} className="text-xs bg-primary/80 text-primary-foreground">
              {g}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleBookmark}
        disabled={isLoading}
        className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
      >
        <Bookmark
          className={`h-4 w-4 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`}
        />
      </Button>
    </div>
  );
};

export default MovieCard;
