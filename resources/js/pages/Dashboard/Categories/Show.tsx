import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { index, edit, destroy } from '@/routes/dashboard/categories';
import { show as courseShow, edit as courseEdit } from '@/routes/dashboard/courses';
import { type BreadcrumbItem } from '@/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Course {
    id: number;
    title: string;
    slug: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    tags: Array<{
        id: number;
        name: string;
    }>;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    courses_count: number;
    courses: Course[];
}

interface Props {
    category: Category;
}

export default function ShowCategory({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Categories', href: '/dashboard/categories' },
        { title: category.name, href: `/dashboard/categories/${category.id}` },
    ];

    const handleDelete = () => {
        router.delete(destroy.url(category.id));
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category: ${category.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index.url()}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Categories
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
                            <p className="text-muted-foreground">
                                Category details and associated courses
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit.url(category.id)}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the category
                                        "{category.name}".
                                        {category.courses_count > 0 && (
                                            <span className="block mt-2 font-medium text-destructive">
                                                This category is currently used by {category.courses_count} course{category.courses_count !== 1 ? 's' : ''}.
                                            </span>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete Category
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Category Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="text-lg">{category.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <code className="text-sm bg-muted px-2 py-1 rounded">{category.slug}</code>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Courses Count</p>
                                <p className="text-lg font-semibold">{category.courses_count}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Associated Courses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Associated Courses ({category.courses_count})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {category.courses.length > 0 ? (
                            <div className="space-y-4">
                                {category.courses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-2">
                                            <h3 className="font-medium">{course.title}</h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className={getLevelColor(course.level)}>
                                                    {course.level}
                                                </Badge>
                                                {course.tags.map((tag) => (
                                                    <Badge key={tag.id} variant="outline">
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={courseShow.url(course.id)}>
                                                <Button variant="outline" size="sm">
                                                    View Course
                                                </Button>
                                            </Link>
                                            <Link href={courseEdit.url(course.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium text-muted-foreground">No courses found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    This category is not currently associated with any courses.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}