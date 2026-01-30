import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export const AuthTest = () => {
  const [email, setEmail] = useState('mrkett25@gmail.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  
  const { login, user, isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">Logged In Successfully!</h3>
              <p className="text-sm text-green-600">
                User: {user?.name} ({user?.email})
              </p>
              <p className="text-sm text-green-600">
                Type: {user?.userType}
              </p>
              <p className="text-sm text-green-600">
                Verified: {user?.verified ? 'Yes' : 'No'}
              </p>
            </div>
            
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mrkett25@gmail.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works for demo"
              />
            </div>

            <Button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login with Mock Backend'}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <p>This will use the mock backend since no real backend is running.</p>
              <p>Try: mrkett25@gmail.com with any password</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthTest;
