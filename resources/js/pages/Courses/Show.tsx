import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { show as courseShow, payment as coursePayment } from '@/routes/courses';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
// import { Progress } from '@/components/ui/progress';
import { CourseGrid } from '@/components/course-grid';
import { 
    Clock, 
    Award, 
    ExternalLink, 
    ArrowLeft, 
    BookOpen, 
    Star,
    Users,
    Calendar,
    CreditCard,
    DollarSign,
    Play,
    Download,
    Globe,
    Target,
    CheckCircle,
    TrendingUp,
    Zap
} from 'lucide-react';
import { PageProps } from '@/types';
import { Course } from '@/types';

interface CourseShowProps extends PageProps {
    course: Course;
    relatedCourses: Course[];
}

export default function CourseShow({ auth, course, relatedCourses }: CourseShowProps) {
    if (!course) {
        return (
            <PublicLayout auth={auth}>
                <Head title="Course Not Found" />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Card className="max-w-md mx-auto">
                            <CardHeader>
                                <CardTitle className="text-destructive">Course Not Found</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    The course you're looking for doesn't exist or has been removed.
                                </p>
                                <Button asChild>
                                    <Link href="/courses">Browse All Courses</Link>
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
                                    <span className="hidden sm:inline">Back to Courses</span>
                                    <span className="sm:hidden">Back</span>
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
                                            course.level === 'Beginner' ? 'border-green-500 border text-green-600 bg-green-50 dark:bg-green-950' :
                                            course.level === 'Intermediate' ? 'border-yellow-500 border text-yellow-600 bg-yellow-50 dark:bg-yellow-950' :
                                            'border-red-500 text-red-600 bg-red-50 dark:bg-red-950'
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
                                            Certificate
                                        </Badge>
                                    )}
                                    {!course.is_paid && (
                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
                                            <Zap className="h-3 w-3 mr-1" />
                                            Free
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
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-semibold text-foreground">{course.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <BookOpen className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Level</p>
                                            <p className="font-semibold text-foreground">{course.level}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                                        <div className="p-2 rounded-lg bg-green-500/10">
                                            <Users className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Platform</p>
                                            <p className="font-semibold text-foreground">{course.platform}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                                        <div className="p-2 rounded-lg bg-purple-500/10">
                                            <DollarSign className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Price</p>
                                            <p className="font-semibold text-foreground">
                                                {course.is_paid ? course.formatted_price : 'Free'}
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
                                                <p className="text-sm text-muted-foreground">Course Price</p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-4xl font-bold text-primary">{course.formatted_price}</span>
                                                </div>
                                            </div>
                                        )}
                                        <CardTitle className="text-xl text-foreground">
                                            {course.is_paid ? 'Enroll Now' : 'Start Learning for Free'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {course.is_paid ? (
                                            <Button 
                                                asChild 
                                                className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg" 
                                                size="lg"
                                            >
                                                <Link 
                                                    href={coursePayment.url(course.id)}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    <CreditCard className="h-5 w-5" />
                                                    Enroll Now
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
                                                    Start Course Free
                                                </a>
                                            </Button>
                                        )}
                                        
                                        {course.is_paid && (
                                            <div className="text-center space-y-3">
                                                <Separator />
                                                <p className="text-sm text-muted-foreground">
                                                    Want to preview first?
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
                                                        Free Preview
                                                    </a>
                                                </Button>
                                            </div>
                                        )}

                                        <Separator />

                                        {/* Course Features */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                What's Included
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>Full course access</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>{course.duration} of content</span>
                                                </div>
                                                {course.have_cert && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        <span>Certificate of completion</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>Lifetime access</span>
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
                                        About This Course
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
                                            Topics Covered
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
                                    <CardTitle className="text-xl text-foreground">Course Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Duration
                                            </span>
                                            <span className="font-medium text-foreground">{course.duration}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Level
                                            </span>
                                            <span className="font-medium text-foreground">{course.level}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                Platform
                                            </span>
                                            <span className="font-medium text-foreground">{course.platform}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Target className="h-4 w-4" />
                                                Category
                                            </span>
                                            <span className="font-medium text-foreground">{course.category.name}</span>
                                        </div>
                                        {course.have_cert && (
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                                                <span className="text-green-700 dark:text-green-300 flex items-center gap-2">
                                                    <Award className="h-4 w-4" />
                                                    Certificate
                                                </span>
                                                <span className="font-medium text-green-700 dark:text-green-300">Available</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                Price
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {course.is_paid ? course.formatted_price : 'Free'}
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
                                <h2 className="text-3xl font-bold text-foreground mb-4">You Might Also Like</h2>
                                <p className="text-muted-foreground text-lg">Discover more courses in {course.category.name}</p>
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