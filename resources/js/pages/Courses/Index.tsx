import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CourseFilters } from '@/components/course-filters';
import { CourseGrid } from '@/components/course-grid';
import { CoursePagination } from '@/components/course-pagination';
import { useCourses } from '@/hooks/use-courses';
import { Course, Category, PaginationMeta } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Filter, Search, Star, Users, Clock, Award, Gift, X } from 'lucide-react';
import PublicLayout from '@/layouts/public/public-layout';

export interface CoursesIndexProps {
    courses: {
        data: Course[];
        meta: PaginationMeta;
    };
    categories: Category[];
    filters: {
        platforms: string[];
        levels: string[];
        price_range: {
            min: number;
            max: number;
        };
        course_type_counts: {
            free: number;
            paid: number;
        };
    };
    current_filters: {
        search?: string;
        category?: string;
        platform?: string;
        level?: string;
        min_price?: number;
        max_price?: number;
        tags?: string[];
        type?: 'free' | 'paid';
    };
}

export default function Index({ courses, categories, filters, current_filters }: CoursesIndexProps) {
    const { courses: coursesData, meta, loading, setFilters, resetFilters } = useCourses({
        initialData: courses,
        initialFilters: current_filters,
    });

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const hasActiveFilters = current_filters ? Object.keys(current_filters).some(key => {
        const value = current_filters[key as keyof typeof current_filters];
        return value !== undefined && value !== null && value !== '' && 
               (Array.isArray(value) ? value.length > 0 : true);
    }) : false;

    const getActiveFiltersCount = () => {
        if (!current_filters) return 0;
        return Object.keys(current_filters).filter(key => {
            const value = current_filters[key as keyof typeof current_filters];
            return value !== undefined && value !== null && value !== '' && 
                   (Array.isArray(value) ? value.length > 0 : true);
        }).length;
    };

    return (
        <>
        <PublicLayout>
            <Head title="Courses" />
            
            {/* Enhanced Hero Section */}
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
                <div className="relative">
                    <div className="container mx-auto px-4 py-16 lg:py-24">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            {/* Main Heading */}
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                                    <BookOpen className="h-4 w-4" />
                                    Discover Your Next Learning Journey
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Explore Courses
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Find the perfect course to advance your skills. From beginner-friendly tutorials to advanced masterclasses.
                                </p>
                            </div>

                            {/* Enhanced Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
                                <div className="group">
                                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition-colors">
                                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                                                {meta?.total?.toLocaleString() || 0}
                                            </div>
                                            <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">
                                                Total Courses
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="group">
                                    <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4 group-hover:bg-green-500/20 transition-colors">
                                                <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
                                                {filters?.course_type_counts?.free?.toLocaleString() || 0}
                                            </div>
                                            <div className="text-sm font-medium text-green-600/80 dark:text-green-400/80">
                                                Free Courses
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="group">
                                    <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-4 group-hover:bg-purple-500/20 transition-colors">
                                                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                                                {categories?.length?.toLocaleString() || 0}
                                            </div>
                                            <div className="text-sm font-medium text-purple-600/80 dark:text-purple-400/80">
                                                Categories
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="group">
                                    <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4 group-hover:bg-orange-500/20 transition-colors">
                                                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-1">
                                                {filters?.platforms?.length?.toLocaleString() || 0}
                                            </div>
                                            <div className="text-sm font-medium text-orange-600/80 dark:text-orange-400/80">
                                                Platforms
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                                <Button size="lg" className="px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Search className="h-5 w-5 mr-2" />
                                    Browse All Courses
                                </Button>
                                <Button variant="outline" size="lg" className="px-8 py-3 text-base font-medium border-2 hover:bg-primary/5">
                                    <Filter className="h-5 w-5 mr-2" />
                                    Advanced Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Enhanced Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Filter Header */}
                            <Card className="border-2 border-primary/10 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Filter className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold">Filters</h2>
                                                <p className="text-sm text-muted-foreground">Refine your search</p>
                                            </div>
                                        </div>
                                        {hasActiveFilters && (
                                            <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
                                                {getActiveFiltersCount()} active
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <CourseFilters
                                        filters={current_filters}
                                        filterOptions={filters}
                                        onFiltersChange={setFilters}
                                        onResetFilters={resetFilters}
                                        loading={loading}
                                    />
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/10">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-primary" />
                                        Quick Stats
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Results found</span>
                                            <Badge variant="outline" className="font-medium">
                                                {meta?.total?.toLocaleString() || 0}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Free courses</span>
                                            <Badge variant="outline" className="font-medium text-green-600">
                                                {filters?.course_type_counts?.free?.toLocaleString() || 0}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Categories</span>
                                            <Badge variant="outline" className="font-medium">
                                                {categories?.length || 0}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Enhanced Results Section */}
                    <div className="lg:col-span-3">
                        {/* Enhanced Results Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div>
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
                                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4" />
                                            Showing {meta.from} - {meta.to} of {meta.total} results
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Sort and View Controls */}
                            <div className="flex items-center gap-3">
                                {/* Sort Dropdown */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                                    <select className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="title">Title A-Z</option>
                                        <option value="popularity">Most Popular</option>
                                    </select>
                                </div>

                                {/* View Toggle */}
                                <div className="flex items-center border border-border rounded-md p-1 bg-muted/30">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                        <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
                                            <div className="bg-current rounded-[1px]"></div>
                                            <div className="bg-current rounded-[1px]"></div>
                                            <div className="bg-current rounded-[1px]"></div>
                                            <div className="bg-current rounded-[1px]"></div>
                                        </div>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
                                        <div className="flex flex-col gap-0.5 h-4 w-4">
                                            <div className="bg-current h-0.5 rounded-full"></div>
                                            <div className="bg-current h-0.5 rounded-full"></div>
                                            <div className="bg-current h-0.5 rounded-full"></div>
                                        </div>
                                    </Button>
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

                        {/* Active Filters */}
                        {hasActiveFilters && current_filters && (
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {current_filters.search && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Search className="h-3 w-3" />
                                            Search: {current_filters.search}
                                        </Badge>
                                    )}
                                    {current_filters.category && (
                                        <Badge variant="secondary">
                                            Category: {current_filters.category}
                                        </Badge>
                                    )}
                                    {current_filters.platform && (
                                        <Badge variant="secondary">
                                            Platform: {current_filters.platform}
                                        </Badge>
                                    )}
                                    {current_filters.level && (
                                        <Badge variant="secondary">
                                            Level: {current_filters.level}
                                        </Badge>
                                    )}
                                    {current_filters.type && (
                                        <Badge variant="secondary">
                                            Type: {current_filters.type === 'free' ? 'Free' : 'Paid'}
                                        </Badge>
                                    )}
                                    {(current_filters.min_price || current_filters.max_price) && (
                                        <Badge variant="secondary">
                                            Price: ${current_filters.min_price || 0} - ${current_filters.max_price || (filters?.price_range?.max || 0)}
                                        </Badge>
                                    )}
                                    {current_filters.tags && current_filters.tags.length > 0 && (
                                        current_filters.tags.map(tag => (
                                            <Badge key={tag} variant="secondary">
                                                Tag: {tag}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <Separator className="mb-8" />

                        {/* Course Grid */}
                        <CourseGrid courses={coursesData} loading={loading} />

                        {/* Pagination */}
                        {meta?.last_page && meta.last_page > 1 && (
                            <div className="mt-12">
                                <CoursePagination
                                    meta={meta}
                                    onPageChange={(page) => handleFilterChange({ page })}
                                    loading={loading}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>

        </>
    );
}