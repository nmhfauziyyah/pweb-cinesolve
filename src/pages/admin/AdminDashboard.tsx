import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Film, MessageSquare, Plus, LogOut } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-bold">CineSolve Admin</span>
          </div>
          
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-xl text-muted-foreground">Manage your movie platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Film className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Movies</h3>
                <p className="text-muted-foreground">Manage your collection</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/admin/movies')}
              className="w-full rounded-xl"
            >
              View Movies
            </Button>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-secondary/10">
                <Plus className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Add Movie</h3>
                <p className="text-muted-foreground">Add new content</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/admin/movies/add')}
              variant="secondary"
              className="w-full rounded-xl"
            >
              Add New Movie
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
