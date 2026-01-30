import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type SupabaseRealtimeEvent = {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  commit_timestamp: string;
  eventType: string;
  new?: any;
  old?: any;
  userId?: string;
};

class SupabaseRealtimeService {
  private static instance: SupabaseRealtimeService;
  private channels: Map<string, RealtimeChannel> = new Map();
  private listeners: Map<string, Set<(event: SupabaseRealtimeEvent) => void>> = new Map();

  static getInstance(): SupabaseRealtimeService {
    if (!SupabaseRealtimeService.instance) {
      SupabaseRealtimeService.instance = new SupabaseRealtimeService();
    }
    return SupabaseRealtimeService.instance;
  }

  // Subscribe to table changes
  subscribeToTable(
    table: string, 
    callback: (event: SupabaseRealtimeEvent) => void,
    filter?: string
  ): () => void {
    const channelName = `${table}_changes_${filter || 'all'}`;
    
    if (!this.listeners.has(channelName)) {
      this.listeners.set(channelName, new Set());
    }
    
    this.listeners.get(channelName)!.add(callback);

    // Create channel if it doesn't exist
    if (!this.channels.has(channelName)) {
      const channel = supabase.channel(channelName);
      
      const subscriptionConfig: any = {
        event: '*',
        schema: 'public',
        table,
      };

      if (filter) {
        subscriptionConfig.filter = filter;
      }

      channel.on('postgres_changes', subscriptionConfig, (payload) => {
        const event: SupabaseRealtimeEvent = {
          type: payload.eventType,
          table: payload.table!,
          schema: payload.schema!,
          commit_timestamp: payload.commit_timestamp!,
          eventType: this.getEventType(payload),
          new: payload.new,
          old: payload.old,
        };

        // Notify all listeners
        const listeners = this.listeners.get(channelName);
        if (listeners) {
          listeners.forEach(listener => listener(event));
        }
      });

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${channelName}`);
        } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn(`Realtime connection issue for ${channelName}: ${status}`);
        }
      });

      this.channels.set(channelName, channel);
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(channelName);
      if (listeners) {
        listeners.delete(callback);
        
        // Clean up channel if no more listeners
        if (listeners.size === 0) {
          const channel = this.channels.get(channelName);
          if (channel) {
            supabase.removeChannel(channel);
            this.channels.delete(channelName);
          }
          this.listeners.delete(channelName);
        }
      }
    };
  }

  // Subscribe to user-specific car listings
  subscribeToUserListings(
    userId: string, 
    callback: (event: SupabaseRealtimeEvent) => void
  ): () => void {
    return this.subscribeToTable(
      'car_listings',
      callback,
      `user_id=eq.${userId}`
    );
  }

  // Subscribe to user-specific payments
  subscribeToUserPayments(
    userId: string, 
    callback: (event: SupabaseRealtimeEvent) => void
  ): () => void {
    return this.subscribeToTable(
      'payments',
      callback,
      `user_id=eq.${userId}`
    );
  }

  // Subscribe to user-specific subscriptions
  subscribeToUserSubscriptions(
    userId: string, 
    callback: (event: SupabaseRealtimeEvent) => void
  ): () => void {
    return this.subscribeToTable(
      'subscriptions',
      callback,
      `user_id=eq.${userId}`
    );
  }

  // Subscribe to all car listings (for admin)
  subscribeToAllListings(callback: (event: SupabaseRealtimeEvent) => void): () => void {
    return this.subscribeToTable('car_listings', callback);
  }

  // Subscribe to all payments (for admin)
  subscribeToAllPayments(callback: (event: SupabaseRealtimeEvent) => void): () => void {
    return this.subscribeToTable('payments', callback);
  }

  // Subscribe to all users (for admin)
  subscribeToAllUsers(callback: (event: SupabaseRealtimeEvent) => void): () => void {
    return this.subscribeToTable('users', callback);
  }

  // Emit custom event (for admin actions)
  emitCustomEvent(event: SupabaseRealtimeEvent) {
    // This would typically be handled by database triggers
    // For now, we'll broadcast to relevant channels
    console.log('Emitting custom event:', event);
    
    // Find relevant channels and notify listeners
    this.listeners.forEach((listeners, channelName) => {
      if (this.shouldNotifyChannel(channelName, event)) {
        listeners.forEach(listener => listener(event));
      }
    });
  }

  private getEventType(payload: any): string {
    const { eventType, table, new: newRecord, old: oldRecord } = payload;
    
    // Convert Supabase events to our custom event types
    if (table === 'car_listings') {
      if (eventType === 'UPDATE') {
        if (oldRecord?.status !== newRecord?.status) {
          return `listing_${newRecord?.status}`;
        }
        if (oldRecord?.featured !== newRecord?.featured) {
          return newRecord?.featured ? 'listing_featured' : 'listing_unfeatured';
        }
      }
    }
    
    if (table === 'payments') {
      if (eventType === 'UPDATE') {
        if (oldRecord?.status !== newRecord?.status) {
          return `payment_${newRecord?.status}`;
        }
      }
    }
    
    if (table === 'users') {
      if (eventType === 'UPDATE') {
        if (oldRecord?.is_active !== newRecord?.is_active) {
          return newRecord?.is_active ? 'user_reactivated' : 'user_suspended';
        }
      }
    }
    
    return `${table}_${eventType.toLowerCase()}`;
  }

  private shouldNotifyChannel(channelName: string, event: SupabaseRealtimeEvent): boolean {
    // Check if this channel should be notified about this event
    if (channelName.includes('user_') && event.userId) {
      return channelName.includes(event.userId);
    }
    
    if (channelName.includes(event.table)) {
      return true;
    }
    
    return false;
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    // This is a simplified check - in reality you'd want to track channel states
    return this.channels.size > 0 ? 'connected' : 'disconnected';
  }

  // Cleanup all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.listeners.clear();
  }
}

// Custom hook for real-time updates
export const useSupabaseRealtime = (userId?: string) => {
  const [lastUpdate, setLastUpdate] = useState<SupabaseRealtimeEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const realtimeService = SupabaseRealtimeService.getInstance();

  useEffect(() => {
    setIsConnected(realtimeService.getConnectionStatus() === 'connected');
  }, []);

  // Subscribe to user-specific updates
  const subscribeToUserUpdates = useCallback((userId: string) => {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to user's car listings
    unsubscribers.push(
      realtimeService.subscribeToUserListings(userId, (event) => {
        setLastUpdate(event);
        console.log('User listing update:', event);
      })
    );

    // Subscribe to user's payments
    unsubscribers.push(
      realtimeService.subscribeToUserPayments(userId, (event) => {
        setLastUpdate(event);
        console.log('User payment update:', event);
      })
    );

    // Subscribe to user's subscriptions
    unsubscribers.push(
      realtimeService.subscribeToUserSubscriptions(userId, (event) => {
        setLastUpdate(event);
        console.log('User subscription update:', event);
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [realtimeService]);

  // Subscribe to admin updates
  const subscribeToAdminUpdates = useCallback(() => {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to all listings
    unsubscribers.push(
      realtimeService.subscribeToAllListings((event) => {
        setLastUpdate(event);
        console.log('Admin listing update:', event);
      })
    );

    // Subscribe to all payments
    unsubscribers.push(
      realtimeService.subscribeToAllPayments((event) => {
        setLastUpdate(event);
        console.log('Admin payment update:', event);
      })
    );

    // Subscribe to all users
    unsubscribers.push(
      realtimeService.subscribeToAllUsers((event) => {
        setLastUpdate(event);
        console.log('Admin user update:', event);
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [realtimeService]);

  // Auto-subscribe when userId changes
  useEffect(() => {
    if (userId) {
      return subscribeToUserUpdates(userId);
    }
  }, [userId, subscribeToUserUpdates]);

  // Emit custom events (for admin actions)
  const emitEvent = useCallback((event: SupabaseRealtimeEvent) => {
    realtimeService.emitCustomEvent(event);
  }, [realtimeService]);

  return {
    lastUpdate,
    isConnected,
    emitEvent,
    subscribeToUserUpdates,
    subscribeToAdminUpdates,
    cleanup: () => realtimeService.cleanup(),
  };
};

// Hook for auto-refreshing data on real-time events
export const useSupabaseAutoRefresh = (
  refreshFunction: () => void,
  eventTypes: string[],
  userId?: string
) => {
  const { lastUpdate } = useSupabaseRealtime(userId);

  useEffect(() => {
    if (lastUpdate && eventTypes.includes(lastUpdate.eventType)) {
      console.log(`Auto-refreshing due to event: ${lastUpdate.eventType}`);
      refreshFunction();
    }
  }, [lastUpdate, eventTypes, refreshFunction]);
};

export default SupabaseRealtimeService.getInstance();
