import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Wifi, 
  WifiOff, 
  Users, 
  Car, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  TestTube
} from 'lucide-react';
import { useAdminSync, useRealtimeSync } from '@/hooks/useRealtimeSync';

const RealtimeTest = () => {
  const [testUserId, setTestUserId] = useState('user_123');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Admin sync for triggering events
  const { triggerListingUpdate, triggerPaymentUpdate, triggerUserUpdate } = useAdminSync();
  
  // User sync for receiving events (simulate user dashboard)
  const { lastUpdate, isConnected, emitEvent } = useRealtimeSync(testUserId);

  const addLog = (log: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()}: ${log}`, ...prev.slice(0, 9)]);
  };

  const testListingApproval = () => {
    const listingId = 'listing_' + Date.now();
    addLog(`Admin: Approving listing ${listingId} for user ${testUserId}`);
    triggerListingUpdate(listingId, 'approved', testUserId);
  };

  const testListingRejection = () => {
    const listingId = 'listing_' + Date.now();
    addLog(`Admin: Rejecting listing ${listingId} for user ${testUserId}`);
    triggerListingUpdate(listingId, 'rejected', testUserId);
  };

  const testPaymentVerification = () => {
    const paymentId = 'pay_' + Date.now();
    addLog(`Admin: Verifying payment ${paymentId} for user ${testUserId}`);
    triggerPaymentUpdate(paymentId, 'verified', testUserId);
  };

  const testUserSuspension = () => {
    addLog(`Admin: Suspending user ${testUserId}`);
    triggerUserUpdate(testUserId, 'suspended');
  };

  const testCustomEvent = () => {
    if (!message.trim()) return;
    
    addLog(`Sending custom event: ${message}`);
    emitEvent('admin_action', { message, custom: true }, testUserId);
    setMessage('');
  };

  // Log received events
  if (lastUpdate) {
    addLog(`User ${testUserId} received: ${lastUpdate.type} - ${JSON.stringify(lastUpdate.data)}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <TestTube className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Real-Time Sync Test</h1>
            <p className="text-gray-600">Test admin-to-user dashboard synchronization</p>
          </div>
        </div>

        {/* Connection Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isConnected ? (
                  <>
                    <Wifi className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-500 font-medium">Disconnected</span>
                  </>
                )}
              </div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Live" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test User Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Test User Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userId">Test User ID</Label>
              <Input
                id="userId"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                placeholder="Enter user ID to test with"
              />
              <p className="text-sm text-gray-600 mt-1">
                This simulates a specific user's dashboard receiving updates
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Admin Actions (Trigger Updates)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={testListingApproval} className="space-x-2">
                <Car className="h-4 w-4" />
                <span>Approve Listing</span>
              </Button>
              
              <Button onClick={testListingRejection} variant="outline" className="space-x-2">
                <Car className="h-4 w-4" />
                <span>Reject Listing</span>
              </Button>
              
              <Button onClick={testPaymentVerification} variant="outline" className="space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Verify Payment</span>
              </Button>
              
              <Button onClick={testUserSuspension} variant="destructive" className="space-x-2">
                <Users className="h-4 w-4" />
                <span>Suspend User</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Event */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Event Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter custom message..."
                onKeyPress={(e) => e.key === 'Enter' && testCustomEvent()}
              />
              <Button onClick={testCustomEvent} disabled={!message.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Event Log</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLogs([])}
              >
                Clear Log
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No events yet. Try triggering some admin actions above.
                </p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm font-mono ${
                      log.includes('Admin:') 
                        ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                        : log.includes('received')
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-gray-50 text-gray-800 border border-gray-200'
                    }`}
                  >
                    {log}
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
            <strong>How to test:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
              <li>Open this page in one browser tab (Admin view)</li>
              <li>Open the User Dashboard in another tab with the same user ID</li>
              <li>Trigger admin actions here and watch the user dashboard update in real-time</li>
              <li>Check the browser console for detailed logging</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default RealtimeTest;
