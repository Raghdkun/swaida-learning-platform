import { useMemo, useState, useCallback, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { useCourses } from '@/hooks/use-courses';
import SidebarCourseFilters from '@/components/sidebar-course-filters';
import { CourseGrid } from '@/components/course-grid';
import { CoursePagination } from '@/components/course-pagination';
import type { Course, Category, PaginationMeta, FilterOptions, CourseFilters } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Filter,
  Search,
  Star,
  Users,
  Clock,
  Award,
  Gift,
  X,
  ChevronDown,
} from 'lucide-react';

export interface CoursesIndexProps {
  courses: { data: Course[]; meta: PaginationMeta };
  categories: Category[];
  filters: FilterOptions & {};
  current_filters: CourseFilters;
}

export default function Index({ courses, categories, filters, current_filters }: CoursesIndexProps) {
  const {
    courses: coursesData,
    meta,
    loading,
    setFilters,
    resetFilters,
    filters: liveFilters,
  } = useCourses({
    initialData: courses,
    initialFilters: current_filters,
  });

  // ===== Active filters =====
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

  // ===== Helpers for chips =====
  const categoryLabel =
    liveFilters?.category &&
    (filters?.categories?.find((c) => c.slug === liveFilters.category)?.name ?? String(liveFilters.category));

  const chips = useMemo(() => {
    const out: Array<{ key: keyof CourseFilters; label: string; value?: string }> = [];
    if (liveFilters?.search) out.push({ key: 'search', label: `Search: ${liveFilters.search}` });
    if (liveFilters?.course_type) out.push({ key: 'course_type', label: `Type: ${liveFilters.course_type}` });
    if (liveFilters?.category) out.push({ key: 'category', label: `Category: ${categoryLabel}` });
    if (liveFilters?.platform) out.push({ key: 'platform', label: `Platform: ${liveFilters.platform}` });
    if (liveFilters?.level) out.push({ key: 'level', label: `Level: ${liveFilters.level}` });
    if (liveFilters?.have_cert) out.push({ key: 'have_cert', label: 'With certificate' });

    if (liveFilters?.tags?.length) {
      const tagNames =
        filters?.tags
          ?.filter((t) => liveFilters.tags?.includes(t.slug))
          .map((t) => ({ name: t.name, slug: t.slug })) ?? [];
      const [first, second, ...rest] = tagNames;
      if (first) out.push({ key: 'tags', label: `Tag: ${first.name}`, value: first.slug });
      if (second) out.push({ key: 'tags', label: `Tag: ${second.name}`, value: second.slug });
      if (rest.length) out.push({ key: 'tags', label: `+${rest.length} more` });
    }

    if (liveFilters?.min_price !== undefined || liveFilters?.max_price !== undefined) {
      const min = liveFilters.min_price ?? 0;
      const max = liveFilters.max_price ?? (filters?.price_range?.max ?? 0);
      out.push({ key: 'min_price', label: `Price: $${min} – $${max}` });
    }
    return out;
  }, [liveFilters, filters?.tags, filters?.price_range?.max, categoryLabel]);

  const removeChip = useCallback(
    (key: keyof CourseFilters, value?: string) => {
      const f: CourseFilters = { ...(liveFilters || {}) };
      if (Array.isArray((f as any)[key])) {
        (f as any)[key] = ((f as any)[key] as string[]).filter((v) => v !== value);
        if ((f as any)[key].length === 0) (f as any)[key] = undefined;
      } else {
        (f as any)[key] = undefined;
      }
      setFilters(f);
    },
    [liveFilters, setFilters]
  );

  // ===== Sticky shadow on scroll =====
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <PublicLayout>
      <Head title="Courses" />

      {/* ===== Hero Section ===== */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="relative">
          <div className="container mx-auto px-4 py-16 lg:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  Discover Your Next Learning Journey
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Explore Courses
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Find the perfect course to advance your skills. From beginner-friendly tutorials to advanced masterclasses.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 mb-3">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                      {meta?.total?.toLocaleString() ?? 0}
                    </div>
                    <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">Total Courses</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 mb-3">
                      <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                      {filters?.course_types?.free?.toLocaleString?.() ?? 0}
                    </div>
                    <div className="text-sm font-medium text-green-600/80 dark:text-green-400/80">Free Courses</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 mb-3">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                      {categories?.length?.toLocaleString?.() ?? 0}
                    </div>
                    <div className="text-sm font-medium text-purple-600/80 dark:text-purple-400/80">Categories</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 mb-3">
                      <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1">
                      {filters?.platforms?.length?.toLocaleString?.() ?? 0}
                    </div>
                    <div className="text-sm font-medium text-orange-600/80 dark:text-orange-400/80">Platforms</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Content Area ===== */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ===== Sidebar Filters ===== */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="sticky top-24 border-2 border-primary/10 shadow-sm">
              <CardContent className="p-6">
                <SidebarCourseFilters
                  filters={liveFilters}
                  filterOptions={filters}
                  onFiltersChange={setFilters}
                  onResetFilters={resetFilters}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>

          {/* ===== Results Area ===== */}
          <div className="flex-1 min-w-0">
            
            {/* ===== Sticky Controls Bar ===== */}
            <div
              className={`sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ${
                elevated ? 'shadow-sm' : ''
              }`}
            >
              <div className="py-4 space-y-4">
                {/* Title + Results Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {meta?.total && meta.total > 0 ? (
                        <>
                          <BookOpen className="h-6 w-6 text-primary" />
                          {meta.total.toLocaleString()} Course{meta.total !== 1 ? 's' : ''} Found
                        </>
                      ) : (
                        <>
                          <Search className="h-6 w-6 text-muted-foreground" />
                          No Courses Found
                        </>
                      )}
                    </h2>
                    {meta?.total && meta.total > 0 && (
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        Showing {meta.from} - {meta.to} of {meta.total} results
                      </p>
                    )}
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</label>
                      <div className="relative">
                        <select
                          className="appearance-none pl-3 pr-8 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[140px]"
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
                        <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        disabled={loading}
                        className="shrink-0 border-2 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reset All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground mr-1">Active filters:</span>
                    {chips.map((chip, idx) => (
                      <Badge
                        key={`${chip.key}-${chip.value ?? idx}`}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1.5 bg-background border"
                      >
                        <span className="text-xs">{chip.label}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                          onClick={() => removeChip(chip.key, chip.value)}
                        />
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-3"
                      onClick={resetFilters}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* ===== Course Grid ===== */}
            <div className="py-6">
              <CourseGrid courses={coursesData} loading={loading} />
            </div>

            {/* ===== Pagination ===== */}
            {!!meta?.last_page && meta.last_page > 1 && (
              <div className="mt-8">
                <CoursePagination
                  meta={meta}
                  onPageChange={(page) => setFilters({ page })}
                  loading={loading}
                />
              </div>
            )}

            {/* ===== Quick Stats ===== */}
            <div className="mt-12">
              <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {meta?.total?.toLocaleString() ?? 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Results found</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {filters?.course_types?.free?.toLocaleString?.() ?? 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Free courses</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {categories?.length ?? 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}