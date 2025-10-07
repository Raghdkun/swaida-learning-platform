import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSearchOptions {
    initialValue?: string;
    debounceMs?: number;
    onSearch?: (query: string) => void;
}

interface UseSearchReturn {
    query: string;
    debouncedQuery: string;
    setQuery: (query: string) => void;
    clearQuery: () => void;
    isSearching: boolean;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
    const { initialValue = '', debounceMs = 300, onSearch } = options;
    
    const [query, setQueryState] = useState(initialValue);
    const [debouncedQuery, setDebouncedQuery] = useState(initialValue);
    const [isSearching, setIsSearching] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const setQuery = useCallback((newQuery: string) => {
        setQueryState(newQuery);
        setIsSearching(true);
    }, []);

    const clearQuery = useCallback(() => {
        setQueryState('');
        setDebouncedQuery('');
        setIsSearching(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedQuery(query);
            setIsSearching(false);
            
            if (onSearch) {
                onSearch(query);
            }
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [query, debounceMs, onSearch]);

    return {
        query,
        debouncedQuery,
        setQuery,
        clearQuery,
        isSearching,
    };
}