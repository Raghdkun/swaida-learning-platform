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
  Tag as TagIcon,
  Globe,
  BookOpen,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Course {
  id: number;
  title: string;
  title_en?: string;
  title_ar?: string | null;
  description: string;
  description_en?: string;
  description_ar?: string | null;
  external_url: string;
  duration: string | null;
  platform: string;
  platform_en?: string;
  platform_ar?: string | null;
  image: string | null;
  image_url?: string | null;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  level_en?: string;
  level_ar?: string | null;
  have_cert: boolean;
  category: { id: number; name: string };
  tags: Array<{ id: number; name: string }>;
  created_at?: string;
  updated_at?: string;
  // Price-related props from backend accessors
  is_paid?: boolean;
  formatted_price?: string | null;
}

interface Props {
  course: Course;
}

const levelColors: Record<string, string> = {
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
    if (!dateString) return '-';
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
              <p className="text-muted-foreground">Course details and information</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/courses/${course.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
              </Button>
            </Link>
            <a href={course.external_url} target="_blank" rel="noopener noreferrer">
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

            {/* English/Arabic Title and Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Title (English)</p>
                    <p className="text-lg">{(course as any).title_en || course.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Title (Arabic)</p>
                    <p className="text-lg" dir="rtl">
                      {(course as any).title_ar ? `${(course as any).title_ar}` : '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description (English)</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {(course as any).description_en || course.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mt-2">Description (Arabic)</p>
                  <p className="leading-relaxed" dir="rtl">
                    {(course as any).description_ar ? `${(course as any).description_ar}` : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {course.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5" />
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
                    {formatDate((course as any).created_at as any)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate((course as any).updated_at as any)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Platform (English)
                    </span>
                    <Badge variant="outline">
                      {(course as any).platform_en || course.platform}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Platform (Arabic)</span>
                    <Badge variant="outline" className="whitespace-normal" style={{ direction: 'rtl' }}>
                      {(course as any).platform_ar ? `${(course as any).platform_ar}` : '-'}
                    </Badge>
                  </div>
                </div>

                {/* Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Level (English)</span>
                    <Badge className={levelColors[(course as any).level_en || course.level] || 'bg-muted'}>
                      {(course as any).level_en || course.level}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Level (Arabic)</span>
                    <Badge variant="outline" className="whitespace-normal" style={{ direction: 'rtl' }}>
                      {(course as any).level_ar ? `${(course as any).level_ar}` : '-'}
                    </Badge>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Category</span>
                  <Badge variant="secondary">{course.category.name}</Badge>
                </div>

                {/* Duration */}
                {course.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration
                    </span>
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>
                )}

                {/* Certificate */}
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

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price</span>
                  <span className="text-sm">
                    {course.is_paid ? course.formatted_price || '-' : 'Free'}
                  </span>
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
