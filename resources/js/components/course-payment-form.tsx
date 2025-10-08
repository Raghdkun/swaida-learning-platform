// resources/js/components/course-payment-form.tsx
import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Upload, X, CreditCard, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Course } from '@/types';
import { store as paymentStore } from '@/routes/courses/payment';

interface CoursePaymentFormProps {
  course: Course;
}

interface PaymentFormData {
  full_name: string;
  phone: string;
  email: string;
  identity_image: File | null;
  reason: string;
  course_id: number;
}

export function CoursePaymentForm({ course }: CoursePaymentFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<PaymentFormData>({
    full_name: '',
    phone: '+963',
    email: '',
    identity_image: null,
    reason: '',
    course_id: course.id,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    form.setData('identity_image', file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    form.setData('identity_image', null);
    setImagePreview(null);
    const fileInput = document.getElementById('identity_image') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Build real FormData to satisfy TS + upload the file
    const payload = new FormData();
    payload.append('full_name', form.data.full_name);
    payload.append('phone', form.data.phone);
    payload.append('email', form.data.email);
    payload.append('reason', form.data.reason);
    payload.append('course_id', String(form.data.course_id));
    if (form.data.identity_image) {
      payload.append('identity_image', form.data.identity_image);
    }

    router.post(paymentStore.url(), payload, {
      forceFormData: true, // harmless when already FormData; keeps consistency
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        setImagePreview(null);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Form */}
      <div className="lg:col-span-2">
        <Card className="border-border bg-card">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Payment Request</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Complete the form below to request payment assistance for this course. Our team will contact you within 24-48 hours.
            </p>
            <Separator />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={form.data.full_name}
                  onChange={(e) => form.setData('full_name', e.target.value)}
                  placeholder="Enter your full name (first, middle, last)"
                  className={form.errors.full_name ? 'border-destructive' : ''}
                  required
                />
                {form.errors.full_name && (
                  <p className="text-sm text-destructive">{form.errors.full_name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.data.phone}
                  onChange={(e) => form.setData('phone', e.target.value)}
                  placeholder="+963 XXX XXX XXX"
                  className={form.errors.phone ? 'border-destructive' : ''}
                  required
                />
                {form.errors.phone && (
                  <p className="text-sm text-destructive">{form.errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={form.errors.email ? 'border-destructive' : ''}
                  required
                />
                {form.errors.email && (
                  <p className="text-sm text-destructive">{form.errors.email}</p>
                )}
              </div>

              {/* Identity Image */}
              <div className="space-y-2">
                <Label htmlFor="identity_image">Identity Image *</Label>
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <div className="space-y-2">
                        <Label
                          htmlFor="identity_image"
                          className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80"
                        >
                          Click to upload identity image
                        </Label>
                        <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                      <Input
                        id="identity_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Identity preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {form.errors.identity_image && (
                  <p className="text-sm text-destructive">{form.errors.identity_image}</p>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Why would you like to buy this course? *</Label>
                <Textarea
                  id="reason"
                  value={form.data.reason}
                  onChange={(e) => form.setData('reason', e.target.value)}
                  placeholder="Please explain why you're interested in this course and how it will help you..."
                  rows={4}
                  className={form.errors.reason ? 'border-destructive' : ''}
                  required
                />
                {form.errors.reason && (
                  <p className="text-sm text-destructive">{form.errors.reason}</p>
                )}
              </div>

              {/* Info Alert */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  After submitting this form, our team will contact you via WhatsApp or email as soon as possible to assist with your payment.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={form.processing}>
                {form.processing ? 'Submitting...' : 'Submit Payment Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar (unchanged) */}
      <div className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Course Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(course.image || course.image_url) && (
              <div className="w-full h-32 overflow-hidden rounded-lg border border-border">
                <img
                  src={course.image ? `/storage/${course.image}` : course.image_url || ''}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground line-clamp-2">{course.title}</h3>

              <div className="flex flex-wrap gap-2">
                {course.category && <Badge variant="secondary">{course.category.name}</Badge>}
                <Badge variant="outline">{course.level}</Badge>
                {course.platform && <Badge variant="outline">{course.platform}</Badge>}
              </div>

              {course.formatted_price && (
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium text-muted-foreground">Course Price:</span>
                  <span className="text-lg font-bold text-primary">{course.formatted_price}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Submit Request</p>
                  <p className="text-xs text-muted-foreground">Fill out the form with your details</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Review Process</p>
                  <p className="text-xs text-muted-foreground">We'll review within 24-48 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Get Access</p>
                  <p className="text-xs text-muted-foreground">Start learning after payment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Your personal information is secure and will only be used for payment processing and course access.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
