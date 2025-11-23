import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DarkModeToggle from '@/components/DarkModeToggle';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in.',
      });
      navigate('/home');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 premium-gradient opacity-20"></div>
      
      <div className="absolute top-6 right-6 z-10">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 rounded-3xl space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Film className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Login;
