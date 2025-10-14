import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { useCourses } from '@/hooks/use-courses';
import { CourseFilters as CourseFiltersPanel } from '@/components/course-filters';
import { CourseGrid } from '@/components/course-grid';
import { CoursePagination } from '@/components/course-pagination';
import type { Course, PaginationMeta, FilterOptions, CourseFilters } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Filter, Search as SearchIcon, Clock, X, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface CoursesSearchProps {
  courses: { data: Course[]; meta: PaginationMeta };
  filters: FilterOptions;
  current_filters: CourseFilters; // normalized by backend
  searchQuery: string;            // original q= value
}

export default function Search({ courses, filters, current_filters, searchQuery }: CoursesSearchProps) {
  const { t } = useTranslation();

  const {
    courses: coursesData,
    meta,
    loading,
    setFilters,
    resetFilters,
    filters: liveFilters,
  } = useCourses({
    initialData: courses,
    // seed the hook with the already-applied filters, including the textual search
    initialFilters: { ...current_filters, search: current_filters?.search ?? searchQuery ?? '' },
  });

  const hasActiveFilters = useMemo(() => {
    const f = liveFilters || {};
    return Object.keys(f).some((k) => {
      const v = (f as any)[k];
      return v !== undefined && v !== null && v !== '' && (!Array.isArray(v) || v.length > 0);
    });
  }, [liveFilters]);

  const activeCount = useMemo(() => {
    const f = liveFilters || {};
    return Object.keys(f).filter((k) => {
      const v = (f as any)[k];
      return v !== undefined && v !== null && v !== '' && (!Array.isArray(v) || v.length > 0);
    }).length;
  }, [liveFilters]);

  return (
    <PublicLayout>
      <Head title={`${t('search.badge')}: ${searchQuery || ''}`} />

      {/* Header / Hero */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        {/* Animated background elements */}
        <div className="absolute top-5 right-20 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-5 left-20 w-12 h-12 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="relative">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto text-center space-y-4 animate-in fade-in-50 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-primary/20">
                <SearchIcon className="h-4 w-4" />
                {t('search.badge')}
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight animate-in slide-in-from-bottom-5 duration-500">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  "{(searchQuery ?? '').toString()}"
                </span>
              </h1>
              <p className="text-muted-foreground animate-in fade-in-50 duration-700 delay-200">
                {t('search.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="border-2 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                        <Filter className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{t('sidebar_filters.filters')}</h2>
                        <p className="text-sm text-muted-foreground">{t('sidebar_filters.refine_results')}</p>
                      </div>
                    </div>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="text-xs font-medium px-3 py-1 animate-pulse">
                        {t('filters.active', { count: activeCount })}
                      </Badge>
                    )}
                  </div>

                  <CourseFiltersPanel
                    filters={liveFilters}
                    filterOptions={filters}
                    onFiltersChange={setFilters}
                    onResetFilters={resetFilters}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results header + sort */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 animate-in slide-in-from-right-5 duration-500">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {meta?.total && meta.total > 0 ? (
                    <>
                      <BookOpen className="h-6 w-6 text-primary animate-pulse" />
                      {t('courses.results.courses_found', { count: meta.total })}
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                      {t('search.no_results', { query: searchQuery })}
                    </>
                  )}
                </h2>
                {meta?.total && meta.total > 0 && (
                  <p className="text-muted-foreground flex items-center gap-2 mt-1 animate-in fade-in-50 duration-500 delay-200">
                    <Clock className="h-4 w-4" />
                    {t('courses.results.showing', { from: meta.from, to: meta.to, total: meta.total })}
                  </p>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('courses.sort.label')}</label>
                  <div className="relative group">
                    <select
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 group-hover:scale-105 group-hover:border-primary/50"
                      value={liveFilters?.sort ?? 'newest'}
                      onChange={(e) => setFilters({ sort: e.target.value as any })}
                    >
                      <option value="newest">{t('courses.sort.newest')}</option>
                      <option value="oldest">{t('courses.sort.oldest')}</option>
                      <option value="price-low">{t('courses.sort.price_low')}</option>
                      <option value="price-high">{t('courses.sort.price_high')}</option>
                      <option value="title">{t('courses.sort.title')}</option>
                      <option value="popularity">{t('courses.sort.popularity')}</option>
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none transition-transform duration-200 group-hover:scale-110" />
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    disabled={loading}
                    className="shrink-0 border-2 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('search.reset_filters')}
                  </Button>
                )}
              </div>
            </div>

            <Separator className="mb-8 animate-in fade-in-50 duration-500 delay-300" />

            {/* Grid */}
            <div className="animate-in fade-in-50 duration-500 delay-400">
              <CourseGrid courses={coursesData} loading={loading} />
            </div>

            {/* Pagination */}
            {!!meta?.last_page && meta.last_page > 1 && (
              <div className="mt-12 animate-in fade-in-50 duration-500 delay-500">
                <CoursePagination
                  meta={meta}
                  onPageChange={(page) => setFilters({ page })}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}