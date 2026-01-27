import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Initialize MMKV
export const storage = new MMKV({
    id: 'zora-storage',
});

/**
 * MMKV Storage Wrapper for Zustand Persist Middleware
 * Conforms to the StateStorage interface required by Zustand
 */
export const zustandStorage: StateStorage = {
    setItem: (name: string, value: string) => {
        return storage.set(name, value);
    },
    getItem: (name: string) => {
        const value = storage.getString(name);
        return value ?? null;
    },
    removeItem: (name: string) => {
        return storage.delete(name);
    },
};

/**
 * Generic storage helpers
 */
export const getItem = <T>(key: string): T | null => {
    const value = storage.getString(key);
    try {
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

export const setItem = <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
};

export const removeItem = (key: string): void => {
    storage.delete(key);
};

/**
 * Async Storage Adapter for TanStack Query
 * Wraps MMKV to conform to the AsyncStorage interface (Promise-based)
 */
export const clientStorage = {
    getItem: async (key: string): Promise<string | null> => {
        const value = storage.getString(key);
        return value ?? null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
        storage.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
        storage.delete(key);
    },
};
