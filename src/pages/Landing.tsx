import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Film, Sparkles, TrendingUp, Heart } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/home');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Heart,
      title: 'Mood-Based Discovery',
      description: 'Find movies that match your current emotional state',
    },
    {
      icon: TrendingUp,
      title: 'Trending Picks',
      description: 'Stay updated with the hottest movies worldwide',
    },
    {
      icon: Sparkles,
      title: 'Premium Experience',
      description: 'Elegant interface designed for movie enthusiasts',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 premium-gradient opacity-30"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold">CineSolve</span>
        </div>
        <DarkModeToggle />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight">
            Discover Movies
            <span className="block premium-gradient bg-clip-text text-transparent">
              Based on Your Mood
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your premium destination for finding the perfect film. Explore, review, and bookmark movies tailored to how you feel.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="rounded-full px-8 text-lg font-semibold transition-smooth hover:scale-105"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="rounded-full px-8 text-lg font-semibold transition-smooth hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-8 rounded-2xl hover-lift"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-blue/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Landing;
