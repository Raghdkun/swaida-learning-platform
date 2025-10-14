import { CourseCard } from './course-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Course } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
  className?: string;
}

export function CourseGrid({ courses, loading = false, className }: CourseGridProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch ${className || ''}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 px-4 ${className || ''}`}>
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300" aria-hidden>
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{t('courses.results.no_courses')}</h3>
            <p className="text-muted-foreground">
              {t('courses.results.no_match_hint')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch ${className || ''}`}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4 border-border bg-card h-full flex flex-col animate-pulse">
      {/* Image skeleton with shimmer effect */}
      <div className="aspect-video w-full rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Header skeleton */}
      <div className="space-y-2 flex-shrink-0">
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-muted rounded"></div>
          <div className="h-5 w-20 bg-muted rounded"></div>
        </div>
        <div className="h-6 w-full bg-muted rounded"></div>
        <div className="h-6 w-3/4 bg-muted rounded"></div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 flex-grow">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-2/3 bg-muted rounded"></div>
      </div>

      {/* Meta info skeleton */}
      <div className="flex gap-4 flex-shrink-0">
        <div className="h-4 w-16 bg-muted rounded"></div>
        <div className="h-4 w-20 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-2 flex-shrink-0">
        <div className="h-5 w-12 bg-muted rounded"></div>
        <div className="h-5 w-16 bg-muted rounded"></div>
        <div className="h-5 w-14 bg-muted rounded"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-2 flex-shrink-0 mt-auto">
        <div className="h-8 flex-1 bg-muted rounded"></div>
        <div className="h-8 flex-1 bg-muted rounded"></div>
      </div>
    </div>
  );
}