import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { show as courseShow } from '@/routes/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MessageCircle, Mail, ArrowLeft, ExternalLink, CheckCircle2, Clock, Shield, CreditCard, Phone, Sparkles, Zap } from 'lucide-react';
import { PageProps } from '@/types';
import { Course } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface PaymentSuccessProps extends PageProps {
  course?: Course;
  submissionData?: {
    full_name: string;
    phone: string;
    email: string;
  };
}

export default function PaymentSuccess({ auth, course, submissionData }: PaymentSuccessProps) {
  const { t } = useTranslation();

  return (
    <PublicLayout auth={auth}>
      <Head title={t('payment_success.title')} />

      <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6 animate-in slide-in-from-left-5 duration-500">
            <Button 
              variant="outline" 
              asChild 
              className="hover:bg-primary/10 transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <Link href={`/courses`} className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">{t('course_show.back')}</span>
                <span className="sm:hidden">{t('course_show.back_mobile')}</span>
              </Link>
            </Button>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8 animate-in fade-in-50 duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('payment_success.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('payment_success.subtitle')}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-full border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300 cursor-pointer">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('payment_success.response_time')}
              </span>
            </div>
          </div>

          {/* Course Information */}
          {course && (
            <Card className="mb-8 animate-in slide-in-from-bottom-5 duration-700 delay-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-semibold">{t('payment_success.course_details')}</CardTitle>
                </div>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6">
                  {(course.image || course.image_url) && (
                    <div className="w-full sm:w-40 h-32 sm:h-28 overflow-hidden rounded-lg border border-border flex-shrink-0 group">
                      <img
                        src={course.image ? `/storage/${course.image}` : course.image_url || ''}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors duration-300 cursor-pointer">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {course.category && (
                        <Badge variant="secondary" className="transition-all duration-200 hover:scale-105 cursor-pointer">
                          {course.category.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className="transition-all duration-200 hover:scale-105 cursor-pointer">
                        {course.level}
                      </Badge>
                      {course.platform && (
                        <Badge variant="outline" className="transition-all duration-200 hover:scale-105 cursor-pointer">
                          {course.platform}
                        </Badge>
                      )}
                      {course.certificate && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800 transition-all duration-200 hover:scale-105 cursor-pointer">
                          <CheckCircle2 className="h-3 w-3 mr-1 transition-transform duration-200 hover:scale-110" />
                          {t('badges.certificate')}
                        </Badge>
                      )}
                    </div>

                    {course.formatted_price && (
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                        <span className="text-sm text-muted-foreground">{t('payment.course_info.price_label')}:</span>
                        <span className="text-2xl font-bold text-primary animate-pulse">{course.formatted_price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submission Details */}
          {submissionData && (
            <Card className="border-border bg-card mb-8 animate-in slide-in-from-bottom-5 duration-700 delay-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('payment_success.submission_details.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      {t('payment_success.submission_details.full_name')}
                    </span>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {submissionData.full_name}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      {t('payment_success.submission_details.phone')}
                    </span>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {submissionData.phone}
                    </p>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      {t('payment_success.submission_details.email')}
                    </span>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {submissionData.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-8 animate-in slide-in-from-bottom-5 duration-700 delay-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">{t('payment_success.next_steps.title')}</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group cursor-pointer hover:bg-muted/30 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-300">
                      <Shield className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                      {t('payment_success.next_steps.review.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {t('payment_success.next_steps.review.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer hover:bg-muted/30 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 group-hover:text-green-600 transition-colors duration-300">
                      <Phone className="h-4 w-4 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                      {t('payment_success.next_steps.whatsapp.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {t('payment_success.next_steps.whatsapp.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer hover:bg-muted/30 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 group-hover:text-purple-600 transition-colors duration-300">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                      {t('payment_success.next_steps.email.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {t('payment_success.next_steps.email.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-50 duration-700 delay-500">
            <Button asChild variant="outline" className="transition-all duration-200 hover:scale-105 active:scale-95 group">
              <Link href="/courses" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                {t('payment_success.actions.browse_more')}
              </Link>
            </Button>

            {course && (
              <Button asChild className="transition-all duration-200 hover:scale-105 active:scale-95 group">
                <Link href={courseShow.url(course.id)} className="inline-flex items-center gap-2">
                  {t('payment_success.actions.view_details')}
                  <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                </Link>
              </Button>
            )}
          </div>

          {/* Contact Information */}
          <Card className="border-border bg-muted/30 mt-8 animate-in fade-in-50 duration-700 delay-600 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                {t('payment_success.help.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('payment_success.help.desc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}