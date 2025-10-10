import { useState, useEffect, useCallback } from 'react';
import { FilterOptions } from '@/types';

interface UseFilterOptionsReturn {
  filterOptions: FilterOptions | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFilterOptions(): UseFilterOptionsReturn {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilterOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/filter-options', {
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (!res.ok) throw new Error('Failed to fetch filter options');
      const data: FilterOptions = await res.json();
      setFilterOptions(data);
    } catch (e: any) {
      setError(e?.message ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFilterOptions(); }, [fetchFilterOptions]);

  const refetch = useCallback(() => fetchFilterOptions(), [fetchFilterOptions]);

  return { filterOptions, loading, error, refetch };
}
