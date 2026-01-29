// API Response Types

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// Query Parameters
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
    search?: string;
    category?: string;
    region?: string;
    vendor?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}

export type ProductQueryParams = PaginationParams & SortParams & FilterParams;

export interface OrderQueryParams extends PaginationParams {
    status?: string;
    startDate?: string;
    endDate?: string;
}
