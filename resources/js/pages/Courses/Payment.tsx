import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { show as courseShow } from '@/routes/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CoursePaymentForm } from '@/components/course-payment-form';
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { PageProps } from '@/types';
import { Course } from '@/types';

interface CoursePaymentProps extends PageProps {
    course: Course;
}

export default function CoursePayment({ auth, course }: CoursePaymentProps) {
    if (!course) {
        return (
            <PublicLayout auth={auth}>
                <Head title="Course Not Found" />
                <div className="py-6 sm:py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Course Not Found</h1>
                                <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                                    The course you are looking for does not exist or has been removed.
                                </p>
                                <Button asChild>
                                    <Link href="/courses" className="inline-flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Courses
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    // Check if course is free
    if (!course.price || course.price <= 0) {
        return (
            <PublicLayout auth={auth}>
                <Head title="Course is Free" />
                <div className="py-6 sm:py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">This Course is Free!</h1>
                                <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                                    <strong>{course.title}</strong> is available for free. You can start learning right away!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild>
                                        <Link href={courseShow.url(course.id)} className="inline-flex items-center gap-2">
                                            <ArrowLeft className="h-4 w-4" />
                                            Back to Course
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <a 
                                            href={course.external_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2"
                                        >
                                            Start Learning
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout auth={auth}>
            <Head title={`Payment - ${course.title}`} />

            <div className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Button variant="outline" asChild>
                            <Link href={courseShow.url(course.id)} className="inline-flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back to Course</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Page Header */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <CreditCard className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                                Course Payment
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Complete your enrollment for this course. Our team will assist you with the payment process.
                        </p>
                    </div>

                    {/* Course Info Header */}
                    <div className="mb-8">
                        <Card className="border-border bg-card">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg font-semibold">Course Information</CardTitle>
                                </div>
                                <Separator />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {(course.image || course.image_url) && (
                                        <div className="w-full sm:w-40 h-32 sm:h-28 overflow-hidden rounded-lg border border-border flex-shrink-0">
                                            <img
                                                src={course.image ? `/storage/${course.image}` : course.image_url || ''}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                                {course.title}
                                            </h2>
                                            <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">
                                                {course.description}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-2">
                                            {course.category && (
                                                <Badge variant="secondary">{course.category.name}</Badge>
                                            )}
                                            <Badge variant="outline">{course.level}</Badge>
                                            {course.platform && (
                                                <Badge variant="outline">{course.platform}</Badge>
                                            )}
                                            {course.certificate && (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 border dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Certificate
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        {course.formatted_price && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Course Price:</span>
                                                <span className="text-2xl font-bold text-primary">{course.formatted_price}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <CoursePaymentForm course={course} />
                </div>
            </div>
        </PublicLayout>
    );
}