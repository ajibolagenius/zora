// User Types
export interface User {
    user_id: string;
    email: string;
    name: string;
    picture?: string;
    phone?: string;
    membership_tier: MembershipTier;
    zora_credits: number;
    loyalty_points: number;
    referral_code?: string;
    cultural_interests: string[];
    created_at: string;
    updated_at?: string;
}

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    vendorId?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    sessionToken: string | null;
}
