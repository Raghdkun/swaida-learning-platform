import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import type { PaginatedData } from '@/types';
import { DashboardPagination } from '@/components/dashboard-pagination';

interface Sponsor {
  id: number;
  full_name: string;
  phone?: string | null;
  email: string;
  initial_amount: string | number;
  current_amount: string | number;
  formatted_initial_amount?: string;
  formatted_current_amount?: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  sponsors: PaginatedData<Sponsor>;
  filters: {
    search?: string;
    sort?: 'full_name' | 'email' | 'current_amount' | 'created_at' | 'updated_at';
    direction?: 'asc' | 'desc';
  };
}

export default function SponsorsIndex({ sponsors, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/dashboard/sponsors', { ...filters, search: searchTerm }, { preserveState: true, replace: true });
  };

  const handleSort = (column: NonNullable<Props['filters']['sort']>) => {
    const direction = (filters.sort === column && filters.direction === 'asc') ? 'desc' : 'asc';
    router.get('/dashboard/sponsors', { ...filters, sort: column, direction }, { preserveState: true, replace: true });
  };

  const destroyOne = (id: number) => {
    if (confirm('Delete this sponsor? This is a soft delete.')) {
      router.delete(`/dashboard/sponsors/${id}`);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Sponsors', href: '/dashboard/sponsors' }]}>
      <Head title="Sponsors" />
      <div className="flex flex-col gap-4 p-4">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
            <p className="text-muted-foreground">Manage sponsor accounts, balances and allocations</p>
          </div>
          <Link href="/dashboard/sponsors/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sponsor
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search full name, email, phone..."
                  className="pl-9"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort('full_name')}>
                      Full Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort('current_amount')}>
                      Balance <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort('created_at')}>
                      Created <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.full_name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {s.formatted_current_amount ?? `${Number(s.current_amount).toFixed(2)} USD`}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/sponsors/${s.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/sponsors/${s.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => destroyOne(s.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {sponsors.data.length === 0 && <div className="py-12 text-center text-muted-foreground">No sponsors found.</div>}
          </CardContent>
        </Card>

        <DashboardPagination data={sponsors} />
      </div>
    </AppLayout>
  );
}
