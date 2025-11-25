import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface WatchSource {
  platformName: string;
  platformIcon: string;
  platformUrl: string;
}

const WATCH_PLATFORMS = [
  { name: 'Netflix', icon: '/netflix.png', url: 'https://www.netflix.com/browse' },
  { name: 'Disney+', icon: '/disney.jpeg', url: 'https://disneyplus.com/' },
  { name: 'Prime Video', icon: '/prime.png', url: 'https://www.primevideo.com/' },
  { name: 'Viu', icon: '/viu.png', url: 'https://www.viu.com/' },
  { name: 'iQiyi', icon: '/iqiyi.png', url: 'https://www.iq.com/' },
  { name: 'Vidio', icon: '/vidio.png', url: 'https://www.vidio.com/' },
  { name: 'WeTV', icon: '/wetv.jpg', url: 'https://wetv.vip/id' },
];

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [posterSource, setPosterSource] = useState<'upload' | 'url'>('upload');
  const [watchSources, setWatchSources] = useState<WatchSource[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: null as File | null,
    posterUrl: '',
    country: '',
    releaseYear: '',
  });

  useEffect(() => {
    fetchGenres();
    fetchCountries();
    fetchMovie();
  }, [id]);

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

  const fetchMovie = async () => {
    try {
      const response = await axiosInstance.get(`/movies/${id}`);
      const movie = response.data;
      
      // Determine poster source from response
      const source = movie.posterUpload ? 'upload' : 'url';
      setPosterSource(source);
      
      setFormData({
        title: movie.title,
        description: movie.description,
        poster: null,
        posterUrl: movie.poster,
        country: movie.country || '',
        releaseYear: movie.year?.toString() || '',
      });
      
      // Set watch sources
      if (movie.watchSources && Array.isArray(movie.watchSources)) {
        setWatchSources(movie.watchSources);
      }
      
      // Find genre IDs by name - wait for genres to be loaded
      setTimeout(() => {
        const genreIds = movie.genres?.map((genreName: string) => {
          const foundGenre = genres.find(g => g.name === genreName);
          return foundGenre?._id;
        }).filter(Boolean) || [];
        setSelectedGenres(genreIds);
      }, 100);
      
      setPreviewUrl(movie.poster);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast({ title: 'Failed to fetch movie', variant: 'destructive' });
      setIsLoading(false);
    }
  };

  // Contoh di AddMovie.tsx/EditMovie.tsx
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('poster', file);

    try {
        // Asumsi API endpoint upload: POST /api/movies/upload-poster
        const response = await axiosInstance.post('/movies/upload-poster', formData);

        // PENTING: Backend HARUS merespons dengan nama file baru (e.g., { fileName: "1678...jpg" })
        const newFileName = response.data.fileName; 

        // Set state form/movie data dengan nama file BARU ini
        setFormData(prev => ({ ...prev, poster: newFileName, uploadMode: 'Upload Image' }));

        // Di sini kamu juga bisa set URL untuk preview temporer
        setPreviewUrl(URL.createObjectURL(file)); 

    } catch (error) {
        console.error('Upload failed:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, poster: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev =>
      prev.includes(genreId) ? prev.filter(g => g !== genreId) : [...prev, genreId]
    );
  };

  const handleAddWatchSource = (platformName: string) => {
    if (!watchSources.find(w => w.platformName === platformName)) {
      const platform = WATCH_PLATFORMS.find(p => p.name === platformName);
      setWatchSources([
        ...watchSources,
        {
          platformName,
          platformIcon: platform?.icon || '/netflix.png',
          platformUrl: platform?.url || '',
        },
      ]);
    }
  };

  const handleWatchSourceUrlChange = (platformName: string, url: string) => {
    setWatchSources(watchSources.map(w => 
      w.platformName === platformName ? { ...w, platformUrl: url } : w
    ));
  };

  const handleRemoveWatchSource = (platformName: string) => {
    setWatchSources(watchSources.filter(w => w.platformName !== platformName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGenres.length === 0) {
      toast({ title: 'Please select at least one genre', variant: 'destructive' });
      return;
    }
    
    if (posterSource === 'upload' && !formData.poster && !previewUrl) {
      toast({ title: 'Please upload or select a poster image', variant: 'destructive' });
      return;
    }
    
    if (posterSource === 'url' && !formData.posterUrl && !previewUrl) {
      toast({ title: 'Please enter a poster URL', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      
      // Append each genre separately for proper array parsing
      const genreNames = selectedGenres.map(id => genres.find(g => g._id === id)?.name).filter(Boolean);
      genreNames.forEach(genre => {
        data.append('genre', genre);
      });
      
      data.append('country', formData.country);
      data.append('releaseYear', formData.releaseYear);
      data.append('moodTags', JSON.stringify([]));
      
      // Append watch sources
      if (watchSources.length > 0) {
        data.append('watchSources', JSON.stringify(watchSources));
      }
      
      if (posterSource === 'upload' && formData.poster) {
        data.append('poster', formData.poster);
      } else if (posterSource === 'url' && formData.posterUrl) {
        data.append('posterUrl', formData.posterUrl);
      }

      await axiosInstance.put(`/movies/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast({ title: 'Movie updated successfully' });
      navigate('/admin/movies');
    } catch (error: any) {
      toast({ 
        title: 'Failed to update movie', 
        description: error.response?.data?.message || 'Unknown error',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 md:px-6 py-4">
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

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Edit Movie</h1>

          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
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
              <Label htmlFor="poster">Movie Poster</Label>
              <div className="space-y-3">
                <div className="flex gap-4 p-3 border border-input rounded-xl bg-background">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="posterSource"
                      value="upload"
                      checked={posterSource === 'upload'}
                      onChange={(e) => {
                        setPosterSource(e.target.value as 'upload' | 'url');
                      }}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">Upload Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="posterSource"
                      value="url"
                      checked={posterSource === 'url'}
                      onChange={(e) => {
                        setPosterSource(e.target.value as 'upload' | 'url');
                        setFormData({ ...formData, poster: null });
                      }}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">Image URL</span>
                  </label>
                </div>

                {posterSource === 'upload' ? (
                  <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary transition">
                    <input
                      id="poster"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="poster" className="cursor-pointer">
                      {previewUrl ? (
                        <div className="space-y-2">
                          <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto" />
                          <p className="text-sm text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="font-semibold">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="Enter image URL (e.g., https://example.com/poster.jpg)"
                      value={formData.posterUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, posterUrl: e.target.value });
                        setPreviewUrl(e.target.value);
                      }}
                      className="rounded-xl"
                    />
                    {previewUrl && (
                      <div className="border rounded-xl p-3 bg-muted">
                        <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto" onError={() => setPreviewUrl('')} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genres">Genres (Select multiple)</Label>
              <div className="flex flex-wrap gap-2 p-3 border border-input rounded-xl bg-background">
                {genres.map((genre) => (
                  <button
                    key={genre._id}
                    type="button"
                    onClick={() => handleGenreToggle(genre._id)}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-2 ${
                      selectedGenres.includes(genre._id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {genre.icon} {genre.name}
                    {selectedGenres.includes(genre._id) && <X className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              {selectedGenres.length === 0 && (
                <p className="text-sm text-red-500">At least one genre is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger id="country" className="rounded-xl">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country._id} value={country.name}>
                      {country.flag} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label>Where to Watch (Optional)</Label>
              <div className="space-y-3">
                {/* Available platforms */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Add platforms (URLs auto-filled):</p>
                  <div className="flex flex-wrap gap-2">
                    {WATCH_PLATFORMS.map((platform) => (
                      <Button
                        key={platform.name}
                        type="button"
                        variant={watchSources.some(w => w.platformName === platform.name) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAddWatchSource(platform.name)}
                        className="rounded-lg"
                      >
                        <img src={platform.icon} alt={platform.name} className="h-4 w-4 mr-1" />
                        {platform.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected platforms */}
                {watchSources.length > 0 && (
                  <div className="space-y-2 p-3 border border-input rounded-xl bg-muted/30">
                    <p className="text-sm font-medium">Selected platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {watchSources.map((source) => (
                        <div
                          key={source.platformName}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 border border-primary/50"
                        >
                          <img src={source.platformIcon} alt={source.platformName} className="h-4 w-4" />
                          <span className="text-sm font-medium">{source.platformName}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWatchSource(source.platformName)}
                            className="h-5 w-5 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
