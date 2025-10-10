import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, LogOut, ExternalLink } from 'lucide-react';

interface CourseLite { id: number; title: string; }
interface Allocation {
  id: number;
  recipient_full_name: string;
  amount: number | string;
  course?: CourseLite | null;
  course_external_url?: string | null;
  admin_note?: string | null;
  created_at: string;
}
interface Transaction {
  id: number;
  type: 'top_up' | 'adjustment' | 'refund';
  amount: number | string;
  reference?: string | null;
  notes?: string | null;
  created_at: string;
}
interface Sponsor {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  formatted_initial_amount?: string;
  formatted_current_amount?: string;
  initial_amount: number | string;
  current_amount: number | string;
  admin_note?: string | null;
  allocations: Allocation[];
  transactions: Transaction[];
  last_login_at?: string | null;
}

export default function SponsorPortal({ sponsor }: { sponsor: Sponsor }) {
  const logout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(`logout`);
  };

  return (
    <>
      <Head title="My Sponsor Portal" />
      <div className="container mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {sponsor.full_name}</h1>
            <p className="text-muted-foreground text-sm">Last login: {sponsor.last_login_at ? new Date(sponsor.last_login_at).toLocaleString() : '—'}</p>
          </div>
          <form onSubmit={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <div className="text-sm"><span className="text-muted-foreground">Email:</span> {sponsor.email}</div>
              <div className="text-sm"><span className="text-muted-foreground">Phone:</span> {sponsor.phone || '—'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Initial Amount</CardTitle></CardHeader>
            <CardContent>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {sponsor.formatted_initial_amount ?? `${Number(sponsor.initial_amount).toFixed(2)} USD`}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Current Balance</CardTitle></CardHeader>
            <CardContent>
              <Badge className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {sponsor.formatted_current_amount ?? `${Number(sponsor.current_amount).toFixed(2)} USD`}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Allocations */}
        <Card>
          <CardHeader><CardTitle>Allocations</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsor.allocations.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <div>{a.recipient_full_name}</div>
                      {a.admin_note && <div className="text-xs text-muted-foreground line-clamp-2">{a.admin_note}</div>}
                    </TableCell>
                    <TableCell>
                      {a.course ? a.course.title : (
                        a.course_external_url ? (
                          <a href={a.course_external_url} className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1" target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3" /> external
                          </a>
                        ) : '—'
                      )}
                    </TableCell>
                    <TableCell>{Number(a.amount).toFixed(2)} USD</TableCell>
                    <TableCell>{new Date(a.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sponsor.allocations.length === 0 && <div className="py-12 text-center text-muted-foreground">No allocations yet.</div>}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsor.transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                    <TableCell>{Number(t.amount).toFixed(2)} USD</TableCell>
                    <TableCell className="text-sm">{t.reference || '—'}</TableCell>
                    <TableCell className="text-sm">{t.notes || '—'}</TableCell>
                    <TableCell>{new Date(t.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sponsor.transactions.length === 0 && <div className="py-12 text-center text-muted-foreground">No transactions yet.</div>}
          </CardContent>
        </Card>
      </div>
      </>
  );
}
