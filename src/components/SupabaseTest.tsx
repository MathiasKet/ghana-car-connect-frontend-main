import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TestTube,
  User,
  Car,
  CreditCard,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import supabaseApi from '@/services/supabaseApi';
import api from '@/services/api';

const SupabaseTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const { user, loading, isAuthenticated, signUp, signIn, signOut } = useSupabaseAuth();
  const { isConnected, lastUpdate } = useSupabaseRealtime();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');

  const addResult = (test: string, success: boolean, message: string, data?: any) => {
    setTestResults(prev => [{
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 9)]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Supabase Connection
    try {
      const isAvailable = supabaseApi.isSupabaseAvailable();
      addResult(
        'Supabase Connection',
        isAvailable,
        isAvailable ? 'Connected to Supabase' : 'Using mock backend',
        { available: isAvailable }
      );
    } catch (error: any) {
      addResult('Supabase Connection', false, error.message);
    }

    // Test 2: Environment Variables
    try {
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      addResult(
        'Environment Variables',
        hasUrl && hasKey,
        hasUrl && hasKey ? 'All variables configured' : 'Missing variables',
        { hasUrl, hasKey }
      );
    } catch (error: any) {
      addResult('Environment Variables', false, error.message);
    }

    // Test 3: Authentication State
    try {
      addResult(
        'Authentication State',
        true,
        isAuthenticated ? 'User authenticated' : 'No authenticated user',
        { isAuthenticated, user: user?.email }
      );
    } catch (error: any) {
      addResult('Authentication State', false, error.message);
    }

    // Test 4: Real-time Connection
    try {
      addResult(
        'Real-time Connection',
        isConnected,
        isConnected ? 'Real-time connected' : 'Real-time disconnected',
        { isConnected, lastUpdate }
      );
    } catch (error: any) {
      addResult('Real-time Connection', false, error.message);
    }

    // Test 5: API Migration
    try {
      const usingSupabase = api.isSupabaseAvailable();
      addResult(
        'API Migration',
        true,
        usingSupabase ? 'Using Supabase API' : 'Using mock API',
        { usingSupabase }
      );
    } catch (error: any) {
      addResult('API Migration', false, error.message);
    }

    // Test 6: User Registration (if not authenticated)
    if (!isAuthenticated) {
      try {
        const result = await signUp(testEmail, testPassword, 'Test User', '+233123456789');
        addResult(
          'User Registration',
          result.success,
          result.success ? 'Registration successful' : result.error || 'Registration failed',
          result
        );
      } catch (error: any) {
        addResult('User Registration', false, error.message);
      }
    }

    // Test 7: User Login (if not authenticated)
    if (!isAuthenticated) {
      try {
        const result = await signIn(testEmail, testPassword);
        addResult(
          'User Login',
          result.success,
          result.success ? 'Login successful' : result.error || 'Login failed',
          result
        );
      } catch (error: any) {
        addResult('User Login', false, error.message);
      }
    }

    // Test 8: Get Cars (if authenticated)
    if (isAuthenticated) {
      try {
        const cars = await supabaseApi.getCars();
        addResult(
          'Get Cars',
          true,
          `Successfully fetched ${cars.length} cars`,
          { count: cars.length }
        );
      } catch (error: any) {
        addResult('Get Cars', false, error.message);
      }
    }

    // Test 9: Get Payment Stats (if authenticated)
    if (isAuthenticated) {
      try {
        const stats = await supabaseApi.getPaymentStats();
        addResult(
          'Get Payment Stats',
          true,
          `Successfully fetched payment stats`,
          stats
        );
      } catch (error: any) {
        addResult('Get Payment Stats', false, error.message);
      }
    }

    setIsRunning(false);
  };

  const testUserSignup = async () => {
    try {
      const result = await signUp(testEmail, testPassword, 'Test User', '+233123456789');
      addResult(
        'Manual Signup Test',
        result.success,
        result.success ? 'Signup successful' : result.error || 'Signup failed',
        result
      );
    } catch (error: any) {
      addResult('Manual Signup Test', false, error.message);
    }
  };

  const testUserLogin = async () => {
    try {
      const result = await signIn(testEmail, testPassword);
      addResult(
        'Manual Login Test',
        result.success,
        result.success ? 'Login successful' : result.error || 'Login failed',
        result
      );
    } catch (error: any) {
      addResult('Manual Login Test', false, error.message);
    }
  };

  const testUserLogout = async () => {
    try {
      const result = await signOut();
      addResult(
        'Manual Logout Test',
        result.success,
        result.success ? 'Logout successful' : result.error || 'Logout failed',
        result
      );
    } catch (error: any) {
      addResult('Manual Logout Test', false, error.message);
    }
  };

  useEffect(() => {
    // Initial connection test
    const isAvailable = supabaseApi.isSupabaseAvailable();
    console.log('Supabase available:', isAvailable);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supabase Integration Test</h1>
            <p className="text-gray-600">Test your Supabase backend connection and functionality</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Supabase Status</p>
                  <p className="text-lg font-semibold">
                    {supabaseApi.isSupabaseAvailable() ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                {supabaseApi.isSupabaseAvailable() ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Real-time</p>
                  <p className="text-lg font-semibold">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                {isConnected ? (
                  <Wifi className="h-6 w-6 text-green-500" />
                ) : (
                  <WifiOff className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Auth Status</p>
                  <p className="text-lg font-semibold">
                    {isAuthenticated ? 'Logged In' : 'Logged Out'}
                  </p>
                </div>
                {isAuthenticated ? (
                  <User className="h-6 w-6 text-green-500" />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuration Status:</strong>
            <div className="mt-2 space-y-1 text-sm">
              <p>• Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</p>
              <p>• Supabase Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}</p>
              <p>• API Mode: {api.isSupabaseAvailable() ? '🟢 Supabase' : '🟡 Mock'}</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Test Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="automated" className="space-y-4">
              <TabsList>
                <TabsTrigger value="automated">Automated Tests</TabsTrigger>
                <TabsTrigger value="manual">Manual Tests</TabsTrigger>
              </TabsList>

              <TabsContent value="automated" className="space-y-4">
                <Button 
                  onClick={runTests} 
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testEmail">Test Email</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="testPassword">Test Password</Label>
                    <Input
                      id="testPassword"
                      type="password"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      placeholder="password"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button onClick={testUserSignup} disabled={loading}>
                    <User className="h-4 w-4 mr-2" />
                    Test Signup
                  </Button>
                  <Button onClick={testUserLogin} disabled={loading} variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Test Login
                  </Button>
                  <Button onClick={testUserLogout} disabled={loading} variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Test Logout
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Test Results</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestResults([])}
              >
                Clear Results
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tests run yet. Click "Run All Tests" to get started.
                </p>
              ) : (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{result.test}</span>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? 'PASS' : 'FAIL'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                        {result.timestamp && (
                          <p className="text-xs text-gray-500 mt-1">{result.timestamp}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Run the SQL schema from <code>supabase-schema.sql</code> in your Supabase SQL Editor</li>
              <li>Update your <code>.env</code> file with your Supabase URL and anon key</li>
              <li>Enable real-time for all tables in Database → Replication</li>
              <li>Run these tests to verify your setup</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SupabaseTest;
