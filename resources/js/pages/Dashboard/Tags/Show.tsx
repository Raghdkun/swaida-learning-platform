import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { index, edit, destroy } from '@/routes/dashboard/tags';
import { show as courseShow, edit as courseEdit } from '@/routes/dashboard/courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react';
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
    category: {
        id: number;
        name: string;
    };
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    courses_count: number;
    courses: Course[];
}

interface Props {
    tag: Tag;
}

export default function ShowTag({ tag }: Props) {
    const breadcrumbs: BreadcrumbItemType[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tags', href: index.url() },
        { title: tag.name, href: '#' }
    ];

    const handleDelete = () => {
        router.delete(destroy.url({ tag: tag.id }));
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
            <Head title={`Tag: ${tag.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index.url()}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tags
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{tag.name}</h1>
                            <p className="text-muted-foreground">
                                Tag details and associated courses
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit.url({ tag: tag.id })}>
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
                                        This action cannot be undone. This will permanently delete the tag
                                        "{tag.name}" and remove it from all associated courses.
                                        {tag.courses_count > 0 && (
                                            <span className="block mt-2 font-medium text-destructive">
                                                This tag is currently used by {tag.courses_count} course{tag.courses_count !== 1 ? 's' : ''}.
                                            </span>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete Tag
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Tag Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tag Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="text-lg">{tag.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <code className="text-sm bg-muted px-2 py-1 rounded">{tag.slug}</code>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Courses Count</p>
                                <p className="text-lg font-semibold">{tag.courses_count}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
{Array.isArray((tag as any).translations) && (tag as any).translations.length > 0 ? (
  <div className="pt-4 mt-2 border-t">
    <p className="text-sm font-medium text-muted-foreground mb-2">Translations</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(tag as any).translations
        .filter((row: any) => row.field === 'name') // ensure only tag.name translations
        .map((row: any, idx: number) => (
          <div key={idx} className="p-3 rounded-md border bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">
              {row.field} — {row.locale.toUpperCase()}
            </div>
            <div className="text-sm" dir={row.locale === 'ar' ? 'rtl' : 'ltr'}>
              {row.locale === 'ar' ? `${row.value}` : row.value}
            </div>
          </div>
        ))}
    </div>
  </div>
) : (
  <div className="pt-2">
    <p className="text-sm text-muted-foreground">No translations found for this tag.</p>
  </div>
)}
                {/* Associated Courses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Associated Courses ({tag.courses_count})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tag.courses.length > 0 ? (
                            <div className="space-y-4">
                                {tag.courses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <h3 className="font-medium">{course.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{course.category.name}</Badge>
                                                <Badge className={getLevelColor(course.level)}>
                                                    {course.level}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={courseShow.url({ course: course.id })}>
                                                <Button variant="outline" size="sm">
                                                    View Course
                                                </Button>
                                            </Link>
                                            <Link href={courseEdit.url({ course: course.id })}>
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
                                    This tag is not currently associated with any courses.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}