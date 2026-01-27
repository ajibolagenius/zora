import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

// Platform-specific storage initialization
let storage: {
    set: (key: string, value: string) => void;
    getString: (key: string) => string | undefined;
    delete: (key: string) => void;
};

if (Platform.OS === 'web') {
    // Web: Use localStorage
    storage = {
        set: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value);
            }
        },
        getString: (key: string) => {
            if (typeof window !== 'undefined') {
                return window.localStorage.getItem(key) ?? undefined;
            }
            return undefined;
        },
        delete: (key: string) => {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        },
    };
} else {
    // Native: Use MMKV
    const { MMKV } = require('react-native-mmkv');
    const mmkvInstance = new MMKV({
        id: 'zora-storage',
    });
    storage = mmkvInstance;
}

/**
 * MMKV Storage Wrapper for Zustand Persist Middleware
 * Conforms to the StateStorage interface required by Zustand
 */
export const zustandStorage: StateStorage = {
    setItem: (name: string, value: string) => {
        storage.set(name, value);
    },
    getItem: (name: string) => {
        const value = storage.getString(name);
        return value ?? null;
    },
    removeItem: (name: string) => {
        storage.delete(name);
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
 * Wraps storage to conform to the AsyncStorage interface (Promise-based)
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
