import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Edit, Calendar, Mail, Phone, FileText, ClipboardList, CheckCircle, XCircle, MessageSquare, Eye,
} from 'lucide-react';
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

interface Props { payment: Payment; }

const statusColors: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export default function CoursePaymentShow({ payment }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course Payments', href: '/dashboard/course-payments' },
    { title: `#${payment.id}`, href: `/dashboard/course-payments/${payment.id}` },
  ];

  const quickSetStatus = (status: Status) => {
    router.put(`/dashboard/course-payments/${payment.id}`, { status }, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Payment #${payment.id}`} />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/course-payments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Payments
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payment Request #{payment.id}</h1>
              <p className="text-muted-foreground">For course: {payment.course?.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/course-payments/${payment.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Identity Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payment.identity_image_url ? (
                  <a href={payment.identity_image_url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={payment.identity_image_url}
                      alt="Identity"
                      className="w-full max-h-[420px] object-contain rounded border"
                    />
                  </a>
                ) : (
                  <p className="text-muted-foreground">No image uploaded.</p>
                )}
              </CardContent>
            </Card>

            {/* Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{payment.reason}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Applicant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name</span>
                  <span className="text-sm">{payment.full_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </span>
                  <a className="text-sm text-blue-600 hover:underline" href={`mailto:${payment.email}`}>{payment.email}</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone
                  </span>
                  <a className="text-sm text-blue-600 hover:underline" href={`tel:${payment.phone}`}>{payment.phone}</a>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course</span>
                  <Badge variant="outline">{payment.course?.title}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={statusColors[payment.status]}>{payment.status}</Badge>
                </div>
                {payment.admin_note && (
                  <div className="mt-2">
                    <div className="text-sm font-medium mb-1">Admin Note</div>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{payment.admin_note}</div>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4" /> Created</span>
                  <span className="text-sm text-muted-foreground">{new Date(payment.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Updated</span>
                  <span className="text-sm text-muted-foreground">{new Date(payment.updated_at).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => quickSetStatus('reviewing')}>
                    <Eye className="mr-2 h-4 w-4" /> Reviewing
                  </Button>
                  <Button variant="outline" onClick={() => quickSetStatus('contacted')}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Contacted
                  </Button>
                  <Button onClick={() => quickSetStatus('approved')}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={() => quickSetStatus('rejected')}>
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
