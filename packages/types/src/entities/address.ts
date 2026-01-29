// Address Types
export interface Address {
    id: string;
    user_id: string;
    label: string;
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
    is_default: boolean;
    instructions?: string;
}
