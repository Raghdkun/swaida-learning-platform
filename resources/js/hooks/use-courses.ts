import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Course, PaginatedResponse, CourseFilters, FilterOptions, PaginationMeta } from '@/types';

interface UseCoursesOptions {
    initialData?: { data: Course[]; meta: PaginationMeta } | PaginatedResponse<Course>;
    initialFilters?: CourseFilters;
    autoFetch?: boolean;
}

interface UseCoursesReturn {
    courses: Course[];
    meta: PaginatedResponse<Course>['meta'] | null;
    links: PaginatedResponse<Course>['links'] | null;
    filters: CourseFilters;
    loading: boolean;
    error: string | null;
    setFilters: (filters: Partial<CourseFilters>) => void;
    resetFilters: () => void;
    fetchCourses: () => void;
    goToPage: (page: number) => void;
}

export function useCourses(options: UseCoursesOptions = {}): UseCoursesReturn {
    const { initialData, initialFilters = {}, autoFetch = true } = options;

    const [courses, setCourses] = useState<Course[]>(initialData?.data || []);
    const [meta, setMeta] = useState<PaginationMeta | null>(
        initialData?.meta || null
    );
    const [links, setLinks] = useState<PaginatedResponse<Course>['links'] | null>(
        'links' in (initialData || {}) ? initialData.links : null
    );
    const [filters, setFiltersState] = useState<CourseFilters>(initialFilters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = useCallback(async (newFilters?: CourseFilters) => {
        setLoading(true);
        setError(null);

        try {
            const filtersToUse = newFilters || filters;
            const queryParams = new URLSearchParams();

            // Add filters to query params
            Object.entries(filtersToUse).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
                    } else {
                        queryParams.append(key, value.toString());
                    }
                }
            });

            const response = await fetch(`/api/courses?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const data: PaginatedResponse<Course> = await response.json();
            setCourses(data?.data || []);
            setMeta(data?.meta || null);
            setLinks(data?.links || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const setFilters = useCallback((newFilters: Partial<CourseFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFiltersState(updatedFilters);
        fetchCourses(updatedFilters);
    }, [filters, fetchCourses]);

    const resetFilters = useCallback(() => {
        const emptyFilters = {};
        setFiltersState(emptyFilters);
        fetchCourses(emptyFilters);
        router.get(route('courses.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [fetchCourses]);

    const goToPage = useCallback((page: number) => {
        setFilters({ ...filters, page });
    }, [filters, setFilters]);

    useEffect(() => {
        if (autoFetch) {
            fetchCourses();
        }
    }, [fetchCourses, autoFetch]);

    return {
        courses,
        meta,
        links,
        filters,
        loading,
        error,
        setFilters,
        resetFilters,
        fetchCourses,
        goToPage,
    };
}