import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import SupabaseService from '@/services/supabaseService';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { signIn, loading, error: authError, isAuthenticated, user } = useSupabaseAuth();

    // If already authenticated and is admin, redirect to admin dashboard
    useEffect(() => {
        const verifyAdmin = async () => {
            if (isAuthenticated && user) {
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    // Don't show error immediately, just let them see the login form
                    // and log in with the correct account if needed.
                    console.log('AdminLogin: Current session is not admin, waiting for login attempt.');
                }
            }
        };
        verifyAdmin();
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        console.log('AdminLogin: Form submitted');

        if (loading) return;

        try {
            console.log('AdminLogin: Signing in...');
            const result = await signIn(formData.email, formData.password);
            console.log('AdminLogin: SignIn result:', !!result.data?.user);

            if (result.success && result.data?.user) {
                console.log('AdminLogin: Authenticated, checking profile...');
                // Fetch latest profile to be absolutely sure
                const { profile } = await SupabaseService.getCurrentUser();
                console.log('AdminLogin: Profile role found:', profile?.role);

                const role = profile?.role || result.data.user.user_metadata?.role || 'user';
                console.log('AdminLogin: Final role determined:', role);

                if (role === 'admin') {
                    console.log('AdminLogin: Access granted, navigating to /admin');
                    navigate('/admin');
                } else {
                    console.log('AdminLogin: Access denied - role is:', role);
                    setLocalError(`Access denied. Your current role is '${role}'. This area requires 'admin'.`);
                }
            }
        } catch (err) {
            console.error('AdminLogin: Fatal error:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold">
                            <span className="text-primary">Admin</span>
                            <span className="text-secondary">Portal</span>
                        </span>
                    </div>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Staff Access</CardTitle>
                        <CardDescription>
                            Sign in with your administrator credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(authError || localError) && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{localError || authError}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="mrkett25@gmail.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password">Secure Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={formData.rememberMe}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="remember" className="text-sm">Remember session</Label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading || !formData.email || !formData.password}>
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Authenticating...
                                    </div>
                                ) : (
                                    'Access Control Panel'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <Separator />
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    <Link to="/" className="text-primary hover:underline font-medium">
                                        ← Back to Website
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;
