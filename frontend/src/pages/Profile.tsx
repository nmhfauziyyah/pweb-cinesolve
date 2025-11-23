import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4">
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

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="font-display text-4xl font-bold">Profile</h1>

          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <div className="flex items-center gap-3 p-4 glass-card rounded-xl">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{user?.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="flex items-center gap-3 p-4 glass-card rounded-xl">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
