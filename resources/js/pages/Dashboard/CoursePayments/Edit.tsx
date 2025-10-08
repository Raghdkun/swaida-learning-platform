import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

type Status = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'contacted';

interface CourseLite { id: number; title: string; }

interface Payment {
  id: number;
  course_id: number;
  full_name: string;
  phone: string;
  email: string;
  identity_image: string | null;
  identity_image_url: string | null;
  reason: string;
  status: Status;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
  course: CourseLite;
}

interface Props {
  payment: Payment;
  courses?: Array<{ id: number; title: string }>; // optional if you want to allow course change
}

interface FormData {
  full_name?: string;
  phone?: string;
  email?: string;
  identity_image?: File | null;
  reason?: string;
  course_id?: string;
  status?: Status;
  admin_note?: string | null;
}

const statuses: Array<{ value: Status; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'contacted', label: 'Contacted' },
];

export default function CoursePaymentEdit({ payment, courses = [] }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course Payments', href: '/dashboard/course-payments' },
    { title: `#${payment.id}`, href: `/dashboard/course-payments/${payment.id}` },
    { title: 'Edit', href: `/dashboard/course-payments/${payment.id}/edit` },
  ];

  const { data, setData, post, processing, errors } = useForm<FormData>({
    full_name: payment.full_name,
    phone: payment.phone,
    email: payment.email,
    identity_image: null,
    reason: payment.reason,
    course_id: String(payment.course_id),
    status: payment.status,
    admin_note: payment.admin_note || '',
  });

  const [preview, setPreview] = useState<string | null>(payment.identity_image_url);

  useEffect(() => {
    if (!data.identity_image) return;
    const file = data.identity_image;
    const url = file ? URL.createObjectURL(file) : null;
    setPreview(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [data.identity_image]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/dashboard/course-payments/${payment.id}`, { forceFormData: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Payment #${payment.id}`} />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/course-payments/${payment.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payment
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Payment Request</h1>
            <p className="text-muted-foreground">
              Update applicant details, status, and notes
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applicant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={data.full_name || ''}
                        onChange={e => setData('full_name', e.target.value)}
                        className={errors.full_name ? 'border-destructive' : ''}
                      />
                      {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email || ''}
                        onChange={e => setData('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={data.phone || ''}
                      onChange={e => setData('phone', e.target.value)}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason *</Label>
                    <Textarea
                      id="reason"
                      value={data.reason || ''}
                      onChange={e => setData('reason', e.target.value)}
                      rows={5}
                      className={errors.reason ? 'border-destructive' : ''}
                    />
                    {errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Identity Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {preview ? (
                    <img src={preview} alt="Identity preview" className="w-full max-h-[360px] object-contain rounded border" />
                  ) : (
                    <p className="text-sm text-muted-foreground">No image selected.</p>
                  )}
                  <Input
                    id="identity_image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => setData('identity_image', e.target.files?.[0] || null)}
                    className={errors.identity_image ? 'border-destructive' : ''}
                  />
                  {errors.identity_image && <p className="text-sm text-destructive">{errors.identity_image}</p>}
                  <p className="text-xs text-muted-foreground">
                    Supported: JPEG/JPG/PNG/WebP. Max 10MB.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="course_id">Course *</Label>
                    <Select
                      value={data.course_id}
                      onValueChange={(v) => setData('course_id', v)}
                    >
                      <SelectTrigger className={errors.course_id ? 'border-destructive' : ''}>
                        <SelectValue placeholder={payment.course?.title || 'Select course'} />
                      </SelectTrigger>
                      <SelectContent>
                        {([payment.course, ...courses.filter(c => c.id !== payment.course_id)] as CourseLite[])
                          .filter(Boolean)
                          .map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.course_id && <p className="text-sm text-destructive">{errors.course_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={data.status}
                      onValueChange={(v: Status) => setData('status', v)}
                    >
                      <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin_note">Admin Note</Label>
                    <Textarea
                      id="admin_note"
                      value={data.admin_note || ''}
                      onChange={(e) => setData('admin_note', e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button type="submit" className="w-full" disabled={processing}>
                      <Save className="mr-2 h-4 w-4" />
                      {processing ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                      Current: <Badge>{payment.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
