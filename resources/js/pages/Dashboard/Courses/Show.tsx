import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Edit,
    ExternalLink,
    Calendar,
    Clock,
    Award,
    Tag,
    Globe,
    BookOpen,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Course {
    id: number;
    title: string;
    description: string;
    external_url: string;
    duration: string | null;
    platform: string;
    image: string | null;
    image_url?: string | null; // Keep for backward compatibility during transition
    level: 'beginner' | 'intermediate' | 'advanced';
    have_cert: boolean;
    category: {
        id: number;
        name: string;
    };
    tags: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    course: Course;
}

const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function ShowCourse({ course }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Courses', href: '/dashboard/courses' },
        { title: course.title, href: `/dashboard/courses/${course.id}` },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/courses">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Courses
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                            <p className="text-muted-foreground">
                                Course details and information
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/courses/${course.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Course
                            </Button>
                        </Link>
                        <a
                            href={course.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Course
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Image */}
                        {(course.image || course.image_url) && (
                            <Card>
                                <CardContent className="p-0">
                                    <img
                                        src={course.image ? `/storage/${course.image}` : course.image_url || ''}
                                        alt={course.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {course.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        {course.tags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag className="h-5 w-5" />
                                        Tags
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {course.tags.map((tag) => (
                                            <Badge key={tag.id} variant="secondary">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Created</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatDate(course.created_at)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Last Updated</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatDate(course.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Platform
                                        </span>
                                        <Badge variant="outline">{course.platform}</Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Level</span>
                                        <Badge className={levelColors[course.level]}>
                                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Category</span>
                                        <Badge variant="secondary">{course.category.name}</Badge>
                                    </div>

                                    {course.duration && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Duration
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {course.duration}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <Award className="h-4 w-4" />
                                            Certificate
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {course.have_cert ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-600">Available</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                    <span className="text-sm text-red-600">Not Available</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={`/dashboard/courses/${course.id}/edit`} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Course
                                    </Button>
                                </Link>
                                
                                <a
                                    href={course.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button variant="outline" className="w-full justify-start">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Visit Course Page
                                    </Button>
                                </a>

                                <Link href="/dashboard/courses" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to All Courses
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Course Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Course ID</span>
                                    <span className="text-sm text-muted-foreground">#{course.id}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Tags Count</span>
                                    <span className="text-sm text-muted-foreground">{course.tags.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}