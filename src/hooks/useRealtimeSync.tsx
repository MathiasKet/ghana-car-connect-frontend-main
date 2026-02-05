import { useState, useEffect, useCallback } from 'react';

// Event types for real-time synchronization
export type SyncEventType = 
  | 'listing_approved'
  | 'listing_rejected'
  | 'listing_featured'
  | 'listing_unfeatured'
  | 'listing_sold'
  | 'listing_deleted'
  | 'payment_verified'
  | 'payment_failed'
  | 'user_suspended'
  | 'user_reactivated'
  | 'subscription_updated'
  | 'admin_action';

export interface SyncEvent {
  type: SyncEventType;
  data: any;
  timestamp: number;
  userId?: string;
  listingId?: string;
  paymentId?: string;
  adminId?: string;
}

// Global event emitter for real-time updates
class EventEmitter {
  private listeners: Map<SyncEventType, Set<(event: SyncEvent) => void>> = new Map();

  subscribe(eventType: SyncEventType, callback: (event: SyncEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  emit(event: SyncEvent) {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  // Emit to specific user
  emitToUser(userId: string, event: SyncEvent) {
    if (event.userId === userId) {
      this.emit(event);
    }
  }
}

// Global event emitter instance
export const eventEmitter = new EventEmitter();

// Mock WebSocket service for development
class MockWebSocketService {
  private callbacks: Set<(event: SyncEvent) => void> = new Set();
  private connected = false;

  connect() {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      
      // Simulate receiving some events
      this.simulateIncomingEvents();
    }, 1000);
  }

  disconnect() {
    this.connected = false;
  }

  subscribe(callback: (event: SyncEvent) => void) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  sendEvent(event: SyncEvent) {
    if (this.connected) {
      // Simulate network delay
      setTimeout(() => {
        this.callbacks.forEach(callback => callback(event));
      }, Math.random() * 500 + 100); // 100-600ms delay
    }
  }

  private simulateIncomingEvents() {
    // Simulate random events for testing
    setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of event
        const events: SyncEvent[] = [
          {
            type: 'listing_approved',
            data: { listingId: 'random_' + Date.now(), status: 'active' },
            timestamp: Date.now(),
            listingId: 'random_' + Date.now()
          },
          {
            type: 'payment_verified',
            data: { paymentId: 'pay_' + Date.now(), amount: 100 },
            timestamp: Date.now(),
            paymentId: 'pay_' + Date.now()
          }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.sendEvent(randomEvent);
      }
    }, 10000); // Every 10 seconds
  }
}

export const webSocketService = new MockWebSocketService();

// Custom hook for real-time synchronization
export const useRealtimeSync = (userId?: string) => {
  const [lastUpdate, setLastUpdate] = useState<SyncEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket service
    webSocketService.connect();
    setIsConnected(true);

    // Subscribe to events
    const unsubscribeWebSocket = webSocketService.subscribe((event) => {
      // Filter events for this user if userId is provided
      if (!userId || event.userId === userId || !event.userId) {
        setLastUpdate(event);
      }
    });

    // Also subscribe to local events
    const unsubscribeLocal = eventEmitter.subscribe('admin_action', (event) => {
      if (!userId || event.userId === userId || !event.userId) {
        setLastUpdate(event);
      }
    });

    return () => {
      unsubscribeWebSocket();
      unsubscribeLocal();
      webSocketService.disconnect();
      setIsConnected(false);
    };
  }, [userId]);

  // Function to emit events (for admin actions)
  const emitEvent = useCallback((eventType: SyncEventType, data: any, targetUserId?: string) => {
    const event: SyncEvent = {
      type: eventType,
      data,
      timestamp: Date.now(),
      userId: targetUserId
    };

    // Emit locally
    eventEmitter.emit(event);
    
    // Send via WebSocket
    webSocketService.sendEvent(event);
  }, []);

  return {
    lastUpdate,
    isConnected,
    emitEvent
  };
};

// Hook for auto-refreshing data when events occur
export const useAutoRefresh = (refreshFunction: () => void, eventTypes: SyncEventType[], userId?: string) => {
  const { lastUpdate } = useRealtimeSync(userId);

  useEffect(() => {
    if (lastUpdate && eventTypes.includes(lastUpdate.type)) {
      refreshFunction();
    }
  }, [lastUpdate, eventTypes, refreshFunction]);
};

// Admin hook for triggering updates
export const useAdminSync = () => {
  const { emitEvent } = useRealtimeSync();

  const triggerListingUpdate = useCallback((listingId: string, action: 'approved' | 'rejected' | 'featured' | 'unfeatured' | 'sold' | 'deleted', userId?: string) => {
    const eventType: SyncEventType = `listing_${action}` as SyncEventType;
    emitEvent(eventType, { listingId, action }, userId);
  }, [emitEvent]);

  const triggerPaymentUpdate = useCallback((paymentId: string, action: 'verified' | 'failed', userId?: string) => {
    const eventType: SyncEventType = `payment_${action}` as SyncEventType;
    emitEvent(eventType, { paymentId, action }, userId);
  }, [emitEvent]);

  const triggerUserUpdate = useCallback((targetUserId: string, action: 'suspended' | 'reactivated') => {
    const eventType: SyncEventType = `user_${action}` as SyncEventType;
    emitEvent(eventType, { userId: targetUserId, action }, targetUserId);
  }, [emitEvent]);

  const triggerSubscriptionUpdate = useCallback((userId: string, subscriptionData: any) => {
    emitEvent('subscription_updated', { userId, subscriptionData }, userId);
  }, [emitEvent]);

  return {
    triggerListingUpdate,
    triggerPaymentUpdate,
    triggerUserUpdate,
    triggerSubscriptionUpdate
  };
};

export default useRealtimeSync;
