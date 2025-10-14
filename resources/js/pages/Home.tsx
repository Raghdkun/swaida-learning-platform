import { useState, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseGrid } from '@/components/course-grid';
import type { Course, FilterOptions, CourseFilters as CourseFiltersType } from '@/types';
import { CourseFilters as CourseFiltersPanel } from '@/components/course-filters';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

/**
 * IMPORTANT FIX:
 * - We pass a MERGING callback to `CourseFiltersPanel.onFiltersChange`
 *   so partial updates (e.g., choosing platform after category) accumulate
 *   instead of replacing the previous filter state.
 */

interface HomeProps {
  featuredCourses: Course[];
  stats: {
    totalCourses: number;
    totalCategories: number;
    totalPlatforms: number;
    coursesWithCertificates: number;
  };
  filterOptions: FilterOptions;
}

export default function Home({ featuredCourses, stats, filterOptions }: HomeProps) {
  const { t } = useTranslation();

  // Store quick search filters locally
  const [quickFilters, setQuickFilters] = useState<CourseFiltersType>({});

  /**
   * Merge partial filter updates
   * - Ensures previously selected filters remain intact.
   * - Allows unsetting by passing `undefined` on a key.
   */
  const mergeQuickFilters = useCallback((patch: Partial<CourseFiltersType>) => {
    setQuickFilters(prev => {
      const next = { ...prev, ...patch };

      // Optional: clean up keys set to undefined (keeps URLs tidy when building query)
      Object.keys(next).forEach((k) => {
        const v = (next as any)[k];
        if (v === undefined || v === null || v === '') delete (next as any)[k];
        if (Array.isArray(v) && v.length === 0) delete (next as any)[k];
      });

      // Always reset page on filter change (if you ever add page to quick search)
      delete (next as any).page;

      return next;
    });
  }, []);

  /**
   * Build a /courses URL with all selected filters.
   * Supports arrays (e.g., tags[]).
   */
  const handleQuickSearch = useCallback(() => {
    const searchParams = new URLSearchParams();

    Object.entries(quickFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(`${key}[]`, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    window.location.href = `/courses${queryString ? `?${queryString}` : ''}`;
  }, [quickFilters]);

  const handleResetFilters = useCallback(() => {
    setQuickFilters({});
  }, []);

  return (
    <PublicLayout>
      <Head title={t('common.site_name')} />

      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-primary/90 dark:via-primary/80 dark:to-primary/70 rounded-xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 shadow-xl border border-primary/20 dark:border-primary/30">
            <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            {/* Animated sparkles for visual interest */}
            <div className="absolute top-4 right-4 opacity-20 animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="relative max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary-foreground/80 animate-bounce" />
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm">
                  {t('home.hero.badge') || 'Discover Your Next Skill'}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-primary-foreground">
                {t('home.hero.title')}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-primary-foreground/90 leading-relaxed max-w-2xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/courses">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background text-foreground hover:bg-background/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <BookOpen className="h-5 w-5" />
                    {t('home.hero.browse_courses')}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => document.getElementById('quick-search')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {t('home.hero.quick_search')}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('home.stats.total_courses')}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalCourses || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('home.stats.categories')}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalCategories || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-500" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('home.stats.platforms')}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalPlatforms || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('home.stats.with_certificates')}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.coursesWithCertificates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Search Section */}
          <Card id="quick-search" className="mb-8 sm:mb-12 border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Filter className="h-5 w-5 text-primary" />
                {t('home.quick_search_section.title')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {t('home.quick_search_section.subtitle') || 'Refine your search and find the perfect course'}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <CourseFiltersPanel
                  filters={quickFilters}
                  // 🔧 FIX: Merge partial patches instead of replacing the whole object
                  onFiltersChange={mergeQuickFilters}
                  onResetFilters={handleResetFilters}
                  filterOptions={filterOptions}
                  loading={false}
                />

                <div className="flex justify-center">
                  <Button
                    onClick={handleQuickSearch}
                    size="lg"
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Search className="h-5 w-5" />
                    {t('home.quick_search_section.search_button')}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Courses Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('home.featured.title')}</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                  {t('home.featured.subtitle')}
                </p>
              </div>
              <Link href="/courses">
                <Button variant="outline" className="flex items-center gap-2 border-border hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95">
                  {t('home.featured.view_all')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {featuredCourses.length > 0 ? (
              <CourseGrid courses={featuredCourses} />
            ) : (
              <Card className="border-border hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{t('home.featured.no_courses')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('home.featured.no_courses_desc')}
                  </p>
                  <Link href="/courses">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95">
                      {t('home.hero.browse_courses')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Popular Categories */}
          {filterOptions.categories && filterOptions.categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('home.popular_categories')}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filterOptions.categories.slice(0, 8).map((category) => {
                  const count = category.courses_count ?? 0;
                  return (
                    <Link
                      key={category.id}
                      href={`/courses?category=${category.slug}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all duration-300 hover:shadow-md group-hover:border-primary border-border hover:-translate-y-1">
                        <CardContent className="p-3 sm:p-4 text-center group-hover:bg-primary/5 transition-colors duration-200 rounded-lg">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
                            {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {t('home.course_count', { count })}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}