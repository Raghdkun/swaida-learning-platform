import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { show as courseShow } from '@/routes/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MessageCircle, Mail, ArrowLeft, ExternalLink, CheckCircle2, Clock, Shield, CreditCard, Phone } from 'lucide-react';
import { PageProps } from '@/types';
import { Course } from '@/types';

interface PaymentSuccessProps extends PageProps {
    course?: Course;
    submissionData?: {
        full_name: string;
        phone: string;
        email: string;
    };
}

export default function PaymentSuccess({ auth, course, submissionData }: PaymentSuccessProps) {
    return (
        <PublicLayout auth={auth}>
            <Head title="Payment Request Submitted" />

            <div className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Button variant="outline" asChild>
                            <Link href={`/courses`} className="inline-flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back to Courses</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full mb-6 shadow-lg">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Payment Request Submitted Successfully!
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                            Thank you for your interest in this course. We've received your payment request and will contact you shortly to complete your enrollment.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-full border border-green-200 dark:border-green-800">
                            <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                Expected response time: 2-4 hours
                            </span>
                        </div>
                    </div>

                    {/* Course Information */}
                    {course && (
                        <Card className="mb-8">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-xl font-semibold">Course Details</CardTitle>
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
                                            <h3 className="text-xl font-bold text-foreground mb-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2">
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
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
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
                    )}

                    {/* Submission Details */}
                    {submissionData && (
                        <Card className="border-border bg-card mb-8">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-foreground">
                                    Your Submission Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Full Name:</span>
                                        <p className="font-medium text-foreground">{submissionData.full_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Phone Number:</span>
                                        <p className="font-medium text-foreground">{submissionData.phone}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-sm text-muted-foreground">Email Address:</span>
                                        <p className="font-medium text-foreground">{submissionData.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Next Steps */}
                    <Card className="mb-8">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <CardTitle className="text-xl font-semibold">What Happens Next?</CardTitle>
                            </div>
                            <Separator />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                            Review Process
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Our team will review your payment request and course enrollment details to ensure everything is in order.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-green-600" />
                                            WhatsApp Contact
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            We'll contact you via WhatsApp within 2-4 hours to discuss payment options and finalize your enrollment.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                                            Email Follow-up
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            You'll receive an email confirmation with detailed payment instructions and course access information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="outline">
                            <Link href="/courses" className="inline-flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Browse More Courses
                            </Link>
                        </Button>
                        
                        {course && (
                            <Button asChild>
                                <Link href={courseShow.url(course.id)} className="inline-flex items-center gap-2">
                                    View Course Details
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Contact Information */}
                    <Card className="border-border bg-muted/30 mt-8">
                        <CardContent className="p-6 text-center">
                            <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                            <p className="text-sm text-muted-foreground">
                                If you have any questions about your payment request or need immediate assistance, 
                                please don't hesitate to contact our support team.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}