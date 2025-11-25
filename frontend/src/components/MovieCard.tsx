import { Bookmark, Star, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  isBookmarkPage?: boolean;
  onRemoveBookmark?: (movieId: string) => void;
}

const BASE_URL = 'http://localhost:3000'; 
const getFullPosterUrl = (posterPath: string) => {
    // 1. Jika sudah URL penuh (eksternal)
    if (posterPath && (posterPath.startsWith('http://') || posterPath.startsWith('https://'))) {
        return posterPath;
    } 
    // 2. Jika sudah ada path statis (seperti /uploads/posters/...)
    // Kita hapus path statisnya dan hanya ambil nama file
    const fileNameOnly = posterPath.split('/').pop(); 

    // 3. Rakit URL lokal yang benar menggunakan nama file saja
    if (fileNameOnly) {
        return `${BASE_URL}/uploads/posters/${fileNameOnly}`;
    }
    
    return '/placeholder.svg'; 
};

const MovieCard = ({ movie, isBookmarkPage = false, onRemoveBookmark }: MovieCardProps) => {
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

  const handleRemoveBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/movies/${movie._id}/bookmark`);
      if (onRemoveBookmark) {
        onRemoveBookmark(movie._id);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
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
          src={getFullPosterUrl(movie.poster)}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
      </div>
      
      {/* Always visible info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 space-y-1">
        <h3 className="font-display text-sm md:text-lg font-bold text-white line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 flex-wrap">
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

      {isBookmarkPage ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRemoveBookmark} className="text-red-500">
              Remove from Bookmarks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
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
      )}
    </div>
  );
};

export default MovieCard;
