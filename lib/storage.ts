import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Platform-specific storage initialization
interface StorageInterface {
    set: (key: string, value: string) => void | Promise<void>;
    getString: (key: string) => string | undefined | null | Promise<string | undefined | null>;
    delete: (key: string) => void | Promise<void>;
}

let storage: StorageInterface;

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
    // Native: Try MMKV, fallback to AsyncStorage for Expo Go
    try {
        const { MMKV } = require('react-native-mmkv');
        const mmkvInstance = new MMKV({
            id: 'zora-storage',
        });
        storage = {
            set: (key, value) => mmkvInstance.set(key, value),
            getString: (key) => mmkvInstance.getString(key),
            delete: (key) => mmkvInstance.delete(key),
        };
    } catch (e) {
        console.warn('MMKV not supported (likely running in Expo Go), falling back to AsyncStorage');
        storage = {
            set: async (key, value) => AsyncStorage.setItem(key, value),
            getString: async (key) => AsyncStorage.getItem(key),
            delete: async (key) => AsyncStorage.removeItem(key),
        };
    }
}

/**
 * Storage Wrapper for Zustand Persist Middleware
 * Conforms to the StateStorage interface required by Zustand through createJSONStorage
 */
export const zustandStorage: StateStorage = {
    setItem: (name: string, value: string) => {
        return storage.set(name, value);
    },
    getItem: (name: string) => {
        return storage.getString(name) as string | null | Promise<string | null>;
    },
    removeItem: (name: string) => {
        return storage.delete(name);
    },
};

/**
 * Generic storage helpers
 * Note: These are now ASYNC to support AsyncStorage fallback
 */
export const getItem = async <T>(key: string): Promise<T | null> => {
    const value = await storage.getString(key);
    try {
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
    await storage.set(key, JSON.stringify(value));
};

export const removeItem = async (key: string): Promise<void> => {
    await storage.delete(key);
};

/**
 * Async Storage Adapter for TanStack Query
 * Wraps storage to conform to the AsyncStorage interface (Promise-based)
 */
export const clientStorage = {
    getItem: async (key: string): Promise<string | null> => {
        const value = await storage.getString(key);
        return value ?? null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
        await storage.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
        await storage.delete(key);
    },
};
