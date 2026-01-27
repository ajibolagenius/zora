import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';

export interface ReviewDraft {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    userName: string;
    updatedAt: number;
}

interface DraftState {
    reviewDrafts: Record<string, ReviewDraft>;

    // Actions
    saveDraft: (productId: string, draft: Omit<ReviewDraft, 'productId' | 'updatedAt'>) => void;
    getDraft: (productId: string) => ReviewDraft | null;
    removeDraft: (productId: string) => void;
    clearAllDrafts: () => void;
}

export const useDraftStore = create<DraftState>()(
    persist(
        (set, get) => ({
            reviewDrafts: {},

            saveDraft: (productId, draftData) => {
                set((state) => ({
                    reviewDrafts: {
                        ...state.reviewDrafts,
                        [productId]: {
                            productId,
                            ...draftData,
                            updatedAt: Date.now(),
                        },
                    },
                }));
            },

            getDraft: (productId) => {
                return get().reviewDrafts[productId] || null;
            },

            removeDraft: (productId) => {
                set((state) => {
                    const newDrafts = { ...state.reviewDrafts };
                    delete newDrafts[productId];
                    return { reviewDrafts: newDrafts };
                });
            },

            clearAllDrafts: () => set({ reviewDrafts: {} }),
        }),
        {
            name: 'zora-draft-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
