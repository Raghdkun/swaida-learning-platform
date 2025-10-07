import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types';

interface UseCourseDetailsOptions {
    courseId: number;
    initialData?: {
        course: Course;
        relatedCourses: Course[];
    };
}

interface UseCourseDetailsReturn {
    course: Course | null;
    relatedCourses: Course[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useCourseDetails(options: UseCourseDetailsOptions): UseCourseDetailsReturn {
    const { courseId, initialData } = options;
    
    const [course, setCourse] = useState<Course | null>(initialData?.course || null);
    const [relatedCourses, setRelatedCourses] = useState<Course[]>(initialData?.relatedCourses || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    const fetchCourseDetails = useCallback(async () => {
        if (!courseId) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/courses/${courseId}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch course details');
            }

            const data = await response.json();
            
            setCourse(data.course);
            setRelatedCourses(data.relatedCourses || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    const refetch = useCallback(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    useEffect(() => {
        if (!initialData && courseId) {
            fetchCourseDetails();
        }
    }, [fetchCourseDetails, initialData, courseId]);

    return {
        course,
        relatedCourses,
        loading,
        error,
        refetch,
    };
}