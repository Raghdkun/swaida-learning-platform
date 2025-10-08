import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Filter, Search, MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, FileText,
} from 'lucide-react';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { DashboardPagination } from '@/components/dashboard-pagination';

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
  course: CourseLite & { title: string };
}

interface Props {
  payments: PaginatedData<Payment>;
  courses: Array<{ id: number; title: string }>;
  filters: {
    search?: string;
    status?: Status | '';
    course_id?: string;
    sort?: 'created_at' | 'updated_at' | 'full_name' | 'email' | 'status';
    direction?: 'asc' | 'desc';
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Course Payments', href: '/dashboard/course-payments' },
];

const statusColors: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export default function CoursePaymentsIndex({ payments, courses, filters }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/dashboard/course-payments', { ...filters, search: searchTerm }, {
      preserveState: true, replace: true,
    });
  };

  const handleFilter = (key: string, value: string) => {
    const v = value === 'all' ? undefined : value;
    router.get('/dashboard/course-payments', { ...filters, [key]: v }, {
      preserveState: true, replace: true,
    });
  };

  const handleSort = (column: NonNullable<Props['filters']['sort']>) => {
    const direction = (filters.sort === column && filters.direction === 'asc') ? 'desc' : 'asc';
    router.get('/dashboard/course-payments', { ...filters, sort: column, direction }, {
      preserveState: true, replace: true,
    });
  };

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(prev => prev.length === payments.data.length ? [] : payments.data.map(p => p.id));
  };

  const destroyOne = (id: number) => {
    if (confirm('Delete this payment request?')) {
      router.delete(`/dashboard/course-payments/${id}`, { preserveScroll: true });
    }
  };

  const destroySelected = () => {
    if (!selected.length) return;
    if (confirm(`Delete ${selected.length} payment request(s)?`)) {
      router.delete('/dashboard/course-payments', {
        data: { ids: selected },
        preserveScroll: true,
        onSuccess: () => setSelected([]),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Course Payments" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Payment Requests</h1>
            <p className="text-muted-foreground">Review, filter, and manage payment requests</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, phone, reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <Select
              value={filters.status || 'all'}
              onValueChange={(v) => handleFilter('status', v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.course_id || 'all'}
              onValueChange={(v) => handleFilter('course_id', v)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" onClick={handleSearch}>Search</Button>
          </CardContent>
        </Card>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{selected.length} selected</span>
                <Button variant="destructive" size="sm" onClick={destroySelected}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === payments.data.length && payments.data.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('full_name')} className="h-auto p-0 font-semibold">
                      Applicant
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Email / Phone</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('status')} className="h-auto p-0 font-semibold">
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('created_at')} className="h-auto p-0 font-semibold">
                      Submitted
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.data.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggle(p.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{p.full_name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{p.reason}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.course?.title}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{p.email}</div>
                      <div className="text-xs text-muted-foreground">{p.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[p.status]}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/course-payments/${p.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/course-payments/${p.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            {p.identity_image_url ? (
                              <a href={p.identity_image_url} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                Identity Image
                              </a>
                            ) : (
                              <div className="text-muted-foreground">No Image</div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => destroyOne(p.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {payments.data.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No payment requests found.</div>
            )}
          </CardContent>
        </Card>

        <DashboardPagination data={payments} />
      </div>
    </AppLayout>
  );
}
