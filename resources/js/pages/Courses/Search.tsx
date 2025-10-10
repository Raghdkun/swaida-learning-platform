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
import { BookOpen, Filter, Search as SearchIcon, Clock, X } from 'lucide-react';
import { useMemo } from 'react';

interface CoursesSearchProps {
  courses: { data: Course[]; meta: PaginationMeta };
  filters: FilterOptions;
  current_filters: CourseFilters; // normalized by backend
  searchQuery: string;           // original q= value
}

export default function Search({ courses, filters, current_filters, searchQuery }: CoursesSearchProps) {
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
      <Head title={`Search: ${searchQuery || ''}`} />

      {/* Header / Hero */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="relative">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <SearchIcon className="h-4 w-4" />
                Search Results
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  “{(searchQuery ?? '').toString()}”
                </span>
              </h1>
              <p className="text-muted-foreground">
                Refine your search below using categories, platforms, levels, tags, price, and certificate options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="border-2 border-primary/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Filter className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <p className="text-sm text-muted-foreground">Refine your results</p>
                      </div>
                    </div>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
                        {activeCount} active
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {meta?.total && meta.total > 0 ? (
                    <>
                      <BookOpen className="h-6 w-6 text-primary" />
                      {meta.total.toLocaleString()} Course{meta.total !== 1 ? 's' : ''} Found
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                      No Results for “{searchQuery}”
                    </>
                  )}
                </h2>
                {meta?.total && meta.total > 0 && (
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    Showing {meta.from} - {meta.to} of {meta.total} results
                  </p>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                  <select
                    className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={liveFilters?.sort ?? 'newest'}
                    onChange={(e) => setFilters({ sort: e.target.value as any })}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="title">Title A-Z</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    disabled={loading}
                    className="shrink-0 border-2 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Grid */}
            <CourseGrid courses={coursesData} loading={loading} />

            {/* Pagination */}
            {!!meta?.last_page && meta.last_page > 1 && (
              <div className="mt-12">
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
