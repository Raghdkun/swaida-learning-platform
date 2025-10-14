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
  Zap,
  Sparkles,
  Star,
  Shield,
  Heart
} from 'lucide-react';
import { PageProps, Course } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { CourseGrid } from '@/components/course-grid';

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
        <div className="min-h-screen flex items-center justify-center animate-in fade-in-50 duration-500">
          <div className="text-center space-y-4">
            <Card className="max-w-md mx-auto border-2 border-destructive/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6" />
                  {t('course_show.not_found')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('course_show.not_found_desc')}
                </p>
                <Button asChild className="transition-all duration-200 hover:scale-105 active:scale-95">
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
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="relative py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back button */}
            <div className="mb-6 animate-in slide-in-from-left-5 duration-500">
              <Button 
                variant="outline" 
                asChild 
                className="hover:bg-primary/10 transition-all duration-200 hover:scale-105 active:scale-95 group"
              >
                <Link href="/courses" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  <span className="hidden sm:inline">{t('course_show.back')}</span>
                  <span className="sm:hidden">{t('course_show.back_mobile')}</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Header */}
              <div className="lg:col-span-2 space-y-6 animate-in slide-in-from-bottom-5 duration-700">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    {course.category.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`border-2 px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer ${
                      course.level === 'Beginner'
                        ? 'border-green-500 border text-green-600 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900'
                        : course.level === 'Intermediate'
                        ? 'border-yellow-500 border text-yellow-600 bg-yellow-50 dark:bg-yellow-950 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                        : 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900'
                    }`}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {course.level}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {course.platform}
                  </Badge>
                  {course.have_cert && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer hover:shadow-lg">
                      <Award className="h-3 w-3 mr-1" />
                      {t('badges.certificate')}
                    </Badge>
                  )}
                  {!course.is_paid && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer hover:shadow-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      {t('badges.free')}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 animate-in fade-in-50 duration-700 delay-200">
                    {course.title}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed animate-in fade-in-50 duration-700 delay-300">
                    {course.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in-50 duration-700 delay-400">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.duration')}</p>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.level')}</p>
                      <p className="font-semibold text-foreground group-hover:text-blue-500 transition-colors duration-300">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="p-2 rounded-lg bg-green-500/10 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.platform')}</p>
                      <p className="font-semibold text-foreground group-hover:text-green-500 transition-colors duration-300">{course.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="p-2 rounded-lg bg-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('course_show.price')}</p>
                      <p className="font-semibold text-foreground group-hover:text-purple-500 transition-colors duration-300">
                        {course.is_paid ? course.formatted_price : t('course_show.free')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1 animate-in slide-in-from-right-5 duration-700">
                <Card className="sticky top-6 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center space-y-4">
                    {course.is_paid && course.formatted_price && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{t('course_show.enroll.price_label')}</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold text-primary animate-pulse">{course.formatted_price}</span>
                        </div>
                      </div>
                    )}
                    <CardTitle className="text-xl text-foreground flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {course.is_paid ? t('course_show.enroll.enroll_now') : t('course_show.enroll.start_free')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.is_paid ? (
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
                        size="lg"
                      >
                        <Link href={coursePayment.url(course.id)} className="flex items-center justify-center gap-2">
                          <Play className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                          {t('course_show.enroll.enroll_now')}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
                        size="lg"
                      >
                        <a
                          href={course.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Play className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
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
                          className="w-full border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:scale-105 active:scale-95 group"
                        >
                          <a
                            href={course.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            {t('course_show.enroll.free_preview')}
                          </a>
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* Course Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                        {t('course_show.includes.title')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group cursor-pointer">
                          <CheckCircle className="h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110" />
                          <span>{t('course_show.includes.full_access')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group cursor-pointer">
                          <CheckCircle className="h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110" />
                          <span>{t('course_show.duration')}: {course.duration}</span>
                        </div>
                        {course.have_cert && (
                          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group cursor-pointer">
                            <CheckCircle className="h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110" />
                            <span>{t('course_show.includes.certificate')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group cursor-pointer">
                          <CheckCircle className="h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110" />
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
                <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 duration-500">
                  <div className="aspect-video w-full overflow-hidden group">
                    <img
                      src={course.image ? `/storage/${course.image}` : course.image_url || ''}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Card>
              )}

              {/* Course Description */}
              <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 duration-500 delay-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary transition-transform duration-200 hover:scale-110" />
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
                <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 duration-500 delay-300">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                      <Target className="h-6 w-6 text-primary transition-transform duration-200 hover:scale-110" />
                      {t('course_show.description.what_learn')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {course.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/10 hover:scale-105 px-3 py-1 text-sm transition-all duration-200 cursor-pointer"
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
            <div className="lg:col-span-1 space-y-6 animate-in fade-in-50 duration-500 delay-400">
              <Card className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    {t('payment_success.course_details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors duration-200">
                        <Clock className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        {t('course_show.duration')}
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors duration-200">
                        <TrendingUp className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        {t('course_show.level')}
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">{course.level}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors duration-200">
                        <Globe className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        {t('course_show.platform')}
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">{course.platform}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors duration-200">
                        <Target className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        {t('sidebar_filters.category')}
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">{course.category.name}</span>
                    </div>
                    {course.have_cert && (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200 hover:scale-105 cursor-pointer group">
                        <span className="text-green-700 dark:text-green-300 flex items-center gap-2 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors duration-200">
                          <Award className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                          {t('badges.certificate')}
                        </span>
                        <span className="font-medium text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors duration-200">
                          {t('common.view')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors duration-200">
                        <DollarSign className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        {t('course_show.price')}
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
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
            <div className="mt-12 lg:mt-16 animate-in fade-in-50 duration-500 delay-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6 text-primary animate-pulse" />
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
    <div className="py-6 sm:py-8 lg:py-12 animate-in fade-in-50 duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 sm:h-10 w-24 sm:w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card hover:shadow-md transition-shadow duration-300">
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
                  <Skeleton className="h-12 w-full hover:scale-105 transition-transform duration-300" />
                  <Skeleton className="h-12 w-full hover:scale-105 transition-transform duration-300" />
                  <Skeleton className="h-12 w-full hover:scale-105 transition-transform duration-300" />
                  <Skeleton className="h-12 w-full hover:scale-105 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border bg-card hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <Skeleton className="h-6 w-24 sm:w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 sm:h-12 w-full hover:scale-105 transition-transform duration-300" />
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