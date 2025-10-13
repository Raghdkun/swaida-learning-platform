import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { show as courseShow, payment as coursePayment } from '@/routes/courses';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Award,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Users,
  DollarSign,
  Play,
  Globe,
  Target,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { PageProps, Course } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface CourseShowProps extends PageProps {
  course: Course;
  relatedCourses: Course[];
}

export default function CourseShow({ auth, course, relatedCourses }: CourseShowProps) {
  const { t } = useTranslation();

  if (!course) {
    return (
      <PublicLayout auth={auth}>
        <Head title={t('course_show.not_found')} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-destructive">{t('course_show.not_found')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('course_show.not_found_desc')}
                </p>
                <Button asChild>
                  <Link href="/courses">{t('course_show.browse_all')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout auth={auth}>
      <Head title={course.title} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="relative py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back button */}
            <div className="mb-6">
              <Button variant="outline" asChild className="hover:bg-primary/10">
                <Link href="/courses" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('course_show.back')}</span>
                  <span className="sm:hidden">{t('course_show.back_mobile')}</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Header */}
              <div className="lg:col-span-2 space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    <Target className="h-3 w-3 mr-1" />
                    {course.category.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`border-2 px-3 py-1 ${
                      course.level === 'Beginner'
                        ? 'border-green-500 border text-green-600 bg-green-50 dark:bg-green-950'
                        : course.level === 'Intermediate'
                        ? 'border-yellow-500 border text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
                        : 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950'
                    }`}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1">
                    <Globe className="h-3 w-3 mr-1" />
                    {course.platform}
                  </Badge>
                  {course.have_cert && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      {t('badges.certificate')}
                    </Badge>
                  )}
                  {!course.is_paid && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      {t('badges.free')}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                    {course.title}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.duration')}</p>
                      <p className="font-semibold text-foreground">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.level')}</p>
                      <p className="font-semibold text-foreground">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.platform')}</p>
                      <p className="font-semibold text-foreground">{course.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.price')}</p>
                      <p className="font-semibold text-foreground">
                        {course.is_paid ? course.formatted_price : t('course_show.free')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6 border-2 border-primary/20 shadow-lg">
                  <CardHeader className="text-center space-y-4">
                    {course.is_paid && course.formatted_price && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{t('course_show.enroll.price_label')}</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold text-primary">{course.formatted_price}</span>
                        </div>
                      </div>
                    )}
                    <CardTitle className="text-xl text-foreground">
                      {course.is_paid ? t('course_show.enroll.enroll_now') : t('course_show.enroll.start_free')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.is_paid ? (
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg"
                        size="lg"
                      >
                        <Link href={coursePayment.url(course.id)} className="flex items-center justify-center gap-2">
                          {/* keep icon */}
                          <Play className="h-5 w-5" />
                          {t('course_show.enroll.enroll_now')}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg"
                        size="lg"
                      >
                        <a
                          href={course.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Play className="h-5 w-5" />
                          {t('course_show.enroll.start_course')}
                        </a>
                      </Button>
                    )}

                    {course.is_paid && (
                      <div className="text-center space-y-3">
                        <Separator />
                        <p className="text-sm text-muted-foreground">
                          {t('course_show.enroll.preview_question')}
                        </p>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-primary/20 hover:bg-primary/5"
                        >
                          <a
                            href={course.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t('course_show.enroll.free_preview')}
                          </a>
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* Course Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {t('course_show.includes.title')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{t('course_show.includes.full_access')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{t('course_show.duration')}: {course.duration}</span>
                        </div>
                        {course.have_cert && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{t('course_show.includes.certificate')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{t('course_show.includes.learn_anywhere')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Image */}
              {(course.image || course.image_url) && (
                <Card className="overflow-hidden border-border">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={course.image ? `/storage/${course.image}` : course.image_url || ''}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Card>
              )}

              {/* Course Description */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    {t('course_show.description.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {course.description}
                  </p>
                </CardContent>
              </Card>

              {/* Topics Covered */}
              {course.tags && course.tags.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                      <Target className="h-6 w-6 text-primary" />
                      {t('course_show.description.what_learn')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {course.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/10 px-3 py-1 text-sm"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Course Details Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    {t('payment_success.course_details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('course_show.duration')}
                      </span>
                      <span className="font-medium text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {t('course_show.level')}
                      </span>
                      <span className="font-medium text-foreground">{course.level}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t('course_show.platform')}
                      </span>
                      <span className="font-medium text-foreground">{course.platform}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {t('sidebar_filters.category')}
                      </span>
                      <span className="font-medium text-foreground">{course.category.name}</span>
                    </div>
                    {course.have_cert && (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                        <span className="text-green-700 dark:text-green-300 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {t('badges.certificate')}
                        </span>
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {t('common.view')} {/* closest generic; replace with a dedicated key like 'available' if you add one */}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {t('course_show.price')}
                      </span>
                      <span className="font-medium text-foreground">
                        {course.is_paid ? course.formatted_price : t('course_show.free')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related courses */}
          {relatedCourses && relatedCourses.length > 0 && (
            <div className="mt-12 lg:mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {t('course_show.related.title')}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {t('course_show.related.subtitle')}
                </p>
              </div>
              <CourseGrid courses={relatedCourses} />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 sm:h-10 w-24 sm:w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 sm:w-20" />
                  <Skeleton className="h-6 w-12 sm:w-16" />
                  <Skeleton className="h-6 w-20 sm:w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 sm:h-8 w-full" />
                  <Skeleton className="h-6 sm:h-8 w-3/4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="aspect-video w-full" />
                <div>
                  <Skeleton className="h-6 w-32 sm:w-48 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border bg-card">
              <CardHeader>
                <Skeleton className="h-6 w-24 sm:w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 sm:h-12 w-full" />
                <div className="pt-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
