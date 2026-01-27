
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage'; // Assuming this exists from authStore
import { Notification } from '../types';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    // Actions
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    subscribeToRealtime: (userId: string) => void;
    unsubscribeFromRealtime: () => void;
}

// Mock notifications for dev
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        user_id: 'mock_user',
        type: 'order',
        title: 'Order #2938 Shipped',
        description: 'Your jollof rice spices are on the way! Track your package to see arrival time.',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
    },
    {
        id: '2',
        user_id: 'mock_user',
        type: 'promo',
        title: 'Flash Sale!',
        description: "20% off all plantain chips for the next hour. Don't miss out on the crunch!",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
    },
    {
        id: '3',
        user_id: 'mock_user',
        type: 'review',
        title: 'Rate your purchase',
        description: 'How was the Fufu flour you bought? Share your thoughts with the community.',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
    },
];

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isLoading: false,

            fetchNotifications: async () => {
                if (!isSupabaseConfigured()) {
                    set({
                        notifications: MOCK_NOTIFICATIONS,
                        unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.is_read).length
                    });
                    return;
                }

                const { user } = useAuthStore.getState();
                if (!user) return;

                set({ isLoading: true });
                try {
                    const client = await getSupabaseClient();
                    const { data, error } = await client
                        .from('notifications')
                        .select('*')
                        .eq('user_id', user.user_id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    const notifications = data as Notification[];
                    set({
                        notifications,
                        unreadCount: notifications.filter(n => !n.is_read).length,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    set({ isLoading: false });
                }
            },

            markAsRead: async (id: string) => {
                // Optimistic update
                const { notifications } = get();
                const updatedNotifications = notifications.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                );

                set({
                    notifications: updatedNotifications,
                    unreadCount: updatedNotifications.filter(n => !n.is_read).length
                });

                if (!isSupabaseConfigured()) return;

                try {
                    const client = await getSupabaseClient();
                    await (client.from('notifications') as any)
                        .update({ is_read: true })
                        .eq('id', id);
                } catch (error) {
                    console.error('Error marking notification as read:', error);
                    // Revert on error? For now, we keep optimistic update.
                }
            },

            markAllAsRead: async () => {
                const { notifications } = get();
                const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }));

                set({
                    notifications: updatedNotifications,
                    unreadCount: 0
                });

                if (!isSupabaseConfigured()) return;

                const { user } = useAuthStore.getState();
                if (!user) return;

                try {
                    const client = await getSupabaseClient();
                    await (client.from('notifications') as any)
                        .update({ is_read: true })
                        .eq('user_id', user.user_id)
                        .eq('is_read', false);
                } catch (error) {
                    console.error('Error marking all notifications as read:', error);
                }
            },

            addNotification: (notification: Notification) => {
                const { notifications } = get();
                // Prevent duplicates
                if (notifications.some(n => n.id === notification.id)) return;

                const updatedNotifications = [notification, ...notifications];
                set({
                    notifications: updatedNotifications,
                    unreadCount: updatedNotifications.filter(n => !n.is_read).length
                });
            },

            subscribeToRealtime: (userId: string) => {
                realtimeService.subscribeToNotifications(userId, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newNotification = payload.new as Notification;
                        get().addNotification(newNotification);
                    }
                });
            },

            unsubscribeFromRealtime: () => {
                // implementation depends on how granular we want to unsubscribe
                // for now we rely on the service to handle cleanup if needed, 
                // or we could add specific unsubscribe methods to the service.
                realtimeService.unsubscribeAll();
            },
        }),
        {
            name: 'notification-storage',
            storage: createJSONStorage(() => zustandStorage),
            skipHydration: true,
        }
    )
);
