import { Bookmark, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Movie {
  id: string;
  title: string;
  poster: string;
  country: string;
  genres: string[];
  year: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group relative glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="font-display text-lg font-bold text-white line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {movie.country}
            </Badge>
            {movie.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleBookmark}
        className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
      >
        <Bookmark
          className={`h-4 w-4 ${isBookmarked ? 'fill-gold text-gold' : ''}`}
        />
      </Button>
    </div>
  );
};

export default MovieCard;
