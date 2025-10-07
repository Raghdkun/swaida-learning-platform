import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ArrowLeft, Search, Plus, Eye, Edit, BookOpen, Users, TrendingUp, Award, Filter } from 'lucide-react';
import { index as levelsIndex, show as levelsShow } from '@/routes/dashboard/levels';
import { show as courseShow, edit as courseEdit, create as courseCreate } from '@/routes/dashboard/courses';
import { show as publicCourseShow } from '@/routes/courses';
import { PaginatedData } from '@/types';

interface Course {
    id: number;
    title: string;
    slug: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: {
        id: number;
        name: string;
        slug: string;
    };
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface Props {
    level: {
        level: 'beginner' | 'intermediate' | 'advanced';
        label: string;
        description: string;
    };
    courses: PaginatedData<Course>;
    filters?: {
        search?: string;
        sort?: string;
        category?: string;
    };
    categories?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

export default function LevelsShow({ level, courses, filters, categories }: Props) {
    // Safely handle filters and categories objects
    const safeFilters = filters || {};
    const safeCategories = categories || [];
    
    const breadcrumbs: BreadcrumbItemType[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Levels', href: '/dashboard/levels' },
        { title: level.level.charAt(0).toUpperCase() + level.level.slice(1), href: `/dashboard/levels/${level.level}` }
    ];

    const [search, setSearch] = useState(() => safeFilters.search || '');
    const [sort, setSort] = useState(() => safeFilters.sort || 'title');
    const [category, setCategory] = useState(() => safeFilters.category || 'all');

    const handleFilter = () => {
        router.get(levelsShow.url(level.level, {
            search: search || undefined,
            sort: sort || undefined,
            category: category === 'all' ? undefined : category,
        }), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSort('title');
        setCategory('all');
        router.get(levelsShow.url(level.level), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'beginner':
                return <Users className="h-5 w-5" />;
            case 'intermediate':
                return <TrendingUp className="h-5 w-5" />;
            case 'advanced':
                return <Award className="h-5 w-5" />;
            default:
                return <BookOpen className="h-5 w-5" />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'advanced':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getLevelGradient = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'from-green-500 to-green-600';
            case 'intermediate':
                return 'from-yellow-500 to-yellow-600';
            case 'advanced':
                return 'from-red-500 to-red-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getLevelDescription = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'Perfect for those just starting their learning journey';
            case 'intermediate':
                return 'For learners with some foundational knowledge';
            case 'advanced':
                return 'Challenging content for experienced learners';
            default:
                return '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${level.label} Level Courses`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={levelsIndex.url()}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Levels
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${getLevelGradient(level.level)} text-white`}>
                                    {getLevelIcon(level.level)}
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight capitalize">{level.label} Courses</h1>
                                <Badge className={getLevelColor(level.level)}>
                                    {courses?.total || 0} course{(courses?.total || 0) !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                {level.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="title">Title (A-Z)</SelectItem>
                                    <SelectItem value="-title">Title (Z-A)</SelectItem>
                                    <SelectItem value="created_at">Oldest First</SelectItem>
                                    <SelectItem value="-created_at">Newest First</SelectItem>
                                    <SelectItem value="updated_at">Last Updated</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {safeCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    Apply Filters
                                </Button>
                                <Button variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Courses List */}
                <div className="space-y-4">
                    {courses.data.length > 0 ? (
                        courses.data.map((course) => (
                            <Card key={course.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                                <Badge variant="outline">
                                                    {course.category.name}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                                                <span>Updated: {new Date(course.updated_at).toLocaleDateString()}</span>
                                            </div>

                                            {course.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {course.tags.map((tag) => (
                                                        <Badge key={tag.id} variant="secondary" className="text-xs">
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            {course.slug && (
                                                <Link href={publicCourseShow.url(course.slug)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>
                                            )}
                                            {course.id && (
                                                <Link href={courseEdit.url(course.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-8">
                                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium text-muted-foreground">
                                    No {level} courses found
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {safeFilters.search || safeFilters.category 
                                        ? 'Try adjusting your filters to see more results.'
                                        : `Create your first ${level} course to get started.`
                                    }
                                </p>
                                {!safeFilters.search && !safeFilters.category && (
                                    <div className="mt-4">
                                        <Link href={courseCreate.url()}>
                            <Button>
                                Create Course
                            </Button>
                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {courses?.data && courses.data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {courses?.from || 0} to{' '}
                            {courses?.to || 0} of{' '}
                            {courses?.total || 0} results
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {courses?.links?.prev && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(courses.links.prev!)}
                                >
                                    Previous
                                </Button>
                            )}
                            
                            {courses?.links?.next && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(courses.links.next!)}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}