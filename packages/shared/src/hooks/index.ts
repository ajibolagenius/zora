/**
 * @zora/shared - Platform-Agnostic Hooks
 * These hooks work with any React environment (web, native)
 * They do not depend on browser-specific or native-specific APIs
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ============================================
// STATE HOOKS
// ============================================

/**
 * useToggle - Boolean state with toggle function
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue(v => !v), []);
    return [value, toggle, setValue];
}

/**
 * useCounter - Numeric state with increment/decrement
 */
export function useCounter(initialValue = 0, { min, max }: { min?: number; max?: number } = {}) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount(c => (max !== undefined ? Math.min(c + 1, max) : c + 1));
    }, [max]);

    const decrement = useCallback(() => {
        setCount(c => (min !== undefined ? Math.max(c - 1, min) : c - 1));
    }, [min]);

    const reset = useCallback(() => setCount(initialValue), [initialValue]);

    return { count, increment, decrement, reset, setCount };
}

/**
 * usePrevious - Track previous value
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

// ============================================
// ASYNC HOOKS
// ============================================

/**
 * useAsync - Handle async operations with loading/error states
 */
export function useAsync<T>(
    asyncFn: () => Promise<T>,
    immediate = true
) {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setError(null);
        try {
            const result = await asyncFn();
            setData(result);
            setStatus('success');
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setStatus('error');
            throw err;
        }
    }, [asyncFn]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);

    return {
        data,
        error,
        status,
        isLoading: status === 'pending',
        isError: status === 'error',
        isSuccess: status === 'success',
        execute,
    };
}

/**
 * useDebounce - Debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * useDebouncedCallback - Debounce a callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => callback(...args), delay);
        }) as T,
        [callback, delay]
    );
}

// ============================================
// FORM HOOKS
// ============================================

/**
 * useForm - Simple form state management
 */
export function useForm<T extends Record<string, unknown>>(initialValues: T) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = useCallback((field: keyof T, value: unknown) => {
        setValues(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    const handleBlur = useCallback((field: keyof T) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    const setFieldError = useCallback((field: keyof T, error: string | undefined) => {
        setErrors(prev => ({ ...prev, [field]: error }));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldError,
        setValues,
        setErrors,
        reset,
        isValid,
    };
}

// ============================================
// PAGINATION HOOKS
// ============================================

/**
 * usePagination - Handle pagination logic
 */
export function usePagination<T>(items: T[], itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const resetPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        resetPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
}

// ============================================
// SELECTION HOOKS
// ============================================

/**
 * useSelection - Handle multi-select logic
 */
export function useSelection<T>(items: T[], keyExtractor: (item: T) => string) {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const isSelected = useCallback((item: T) => {
        return selectedKeys.has(keyExtractor(item));
    }, [selectedKeys, keyExtractor]);

    const toggle = useCallback((item: T) => {
        const key = keyExtractor(item);
        setSelectedKeys(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }, [keyExtractor]);

    const selectAll = useCallback(() => {
        setSelectedKeys(new Set(items.map(keyExtractor)));
    }, [items, keyExtractor]);

    const deselectAll = useCallback(() => {
        setSelectedKeys(new Set());
    }, []);

    const selectedItems = useMemo(() => {
        return items.filter(item => selectedKeys.has(keyExtractor(item)));
    }, [items, selectedKeys, keyExtractor]);

    return {
        selectedKeys: Array.from(selectedKeys),
        selectedItems,
        isSelected,
        toggle,
        selectAll,
        deselectAll,
        selectedCount: selectedKeys.size,
        isAllSelected: selectedKeys.size === items.length && items.length > 0,
    };
}

// ============================================
// INTERVAL/TIMEOUT HOOKS
// ============================================

/**
 * useInterval - Run callback at interval
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const tick = () => savedCallback.current();
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

/**
 * useTimeout - Run callback after timeout
 */
export function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const id = setTimeout(() => savedCallback.current(), delay);
        return () => clearTimeout(id);
    }, [delay]);
}
