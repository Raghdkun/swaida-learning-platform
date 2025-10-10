import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, DollarSign, PlusCircle, Trash2, Save, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface CourseLite { id: number; title: string; }

interface Allocation {
  id: number;
  sponsor_id: number;
  recipient_full_name: string;
  course_id?: number | null;
  course_external_url?: string | null;
  amount: number | string;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
  course?: CourseLite | null;
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
  phone?: string | null;
  email: string;
  initial_amount: number | string;
  current_amount: number | string;
  formatted_initial_amount?: string;
  formatted_current_amount?: string;
  admin_note?: string | null;
  allocations: Allocation[];
  transactions: Transaction[];
  created_at: string;
  updated_at: string;
}

export default function SponsorShow({ sponsor }: { sponsor: Sponsor }) {
  // Add funds form
  const fundForm = useForm({
    type: 'top_up' as 'top_up' | 'adjustment',
    amount: '' as number | string,
    reference: '',
    notes: '',
  });

  // New allocation form
  const allocForm = useForm({
    recipient_full_name: '',
    course_id: '' as string | '',
    course_external_url: '',
    amount: '' as number | string,
    admin_note: '',
  });

  const submitFunds = (e: React.FormEvent) => {
    e.preventDefault();
    fundForm.post(`/dashboard/sponsors/${sponsor.id}/funds`, {
      onSuccess: () => fundForm.reset('amount', 'reference', 'notes'),
    });
  };

  const submitAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    allocForm.post(`/dashboard/sponsors/${sponsor.id}/allocations`, {
      onSuccess: () => allocForm.reset('recipient_full_name', 'course_id', 'course_external_url', 'amount', 'admin_note'),
    });
  };

  const deleteAllocation = (allocationId: number) => {
    if (!confirm('Delete this allocation and refund the amount?')) return;
    allocForm.delete(`/dashboard/sponsors/${sponsor.id}/allocations/${allocationId}`);
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Sponsors', href: '/dashboard/sponsors' },
      { title: sponsor.full_name, href: `/dashboard/sponsors/${sponsor.id}` },
    ]}>
      <Head title={sponsor.full_name} />
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sponsors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{sponsor.full_name}</h1>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <div className="text-sm"><span className="text-muted-foreground">Email:</span> {sponsor.email}</div>
              <div className="text-sm"><span className="text-muted-foreground">Phone:</span> {sponsor.phone || '-'}</div>
              {sponsor.admin_note && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Admin Note:</span>
                    <div className="whitespace-pre-wrap">{sponsor.admin_note}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Amounts</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Initial Amount</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {sponsor.formatted_initial_amount ?? `${Number(sponsor.initial_amount).toFixed(2)} USD`}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Balance</span>
                <Badge className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {sponsor.formatted_current_amount ?? `${Number(sponsor.current_amount).toFixed(2)} USD`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Add Funds</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={submitFunds}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <Select value={fundForm.data.type} onValueChange={(v: 'top_up'|'adjustment') => fundForm.setData('type', v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top_up">Top-up</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Amount *</Label>
                    <Input type="number" min="0.01" step="0.01" value={fundForm.data.amount} onChange={(e) => fundForm.setData('amount', e.target.value)} />
                    {fundForm.errors.amount && <p className="text-sm text-destructive">{fundForm.errors.amount}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Reference</Label>
                  <Input value={fundForm.data.reference} onChange={(e) => fundForm.setData('reference', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Notes</Label>
                  <Textarea rows={3} value={fundForm.data.notes} onChange={(e) => fundForm.setData('notes', e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={fundForm.processing}>
                    <Save className="mr-2 h-4 w-4" />
                    {fundForm.processing ? 'Saving...' : 'Add Funds'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Allocation Form */}
        <Card>
          <CardHeader><CardTitle>New Allocation</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={submitAllocation}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Recipient Full Name *</Label>
                  <Input value={allocForm.data.recipient_full_name} onChange={(e) => allocForm.setData('recipient_full_name', e.target.value)} />
                  {allocForm.errors.recipient_full_name && <p className="text-sm text-destructive">{allocForm.errors.recipient_full_name}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Amount *</Label>
                  <Input type="number" min="0.01" step="0.01" value={allocForm.data.amount} onChange={(e) => allocForm.setData('amount', e.target.value)} />
                  {allocForm.errors.amount && <p className="text-sm text-destructive">{allocForm.errors.amount}</p>}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Course ID (optional)</Label>
                  <Input value={allocForm.data.course_id} onChange={(e) => allocForm.setData('course_id', e.target.value)} placeholder="e.g. 123" />
                  {allocForm.errors.course_id && <p className="text-sm text-destructive">{allocForm.errors.course_id}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Course External URL (fallback)</Label>
                  <Input value={allocForm.data.course_external_url} onChange={(e) => allocForm.setData('course_external_url', e.target.value)} placeholder="https://..." />
                  {allocForm.errors.course_external_url && <p className="text-sm text-destructive">{allocForm.errors.course_external_url}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Admin Note</Label>
                <Textarea rows={3} value={allocForm.data.admin_note} onChange={(e) => allocForm.setData('admin_note', e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={allocForm.processing}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {allocForm.processing ? 'Saving...' : 'Create Allocation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Allocations Table */}
        <Card>
          <CardHeader><CardTitle>Allocations</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsor.allocations.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <div>{a.recipient_full_name}</div>
                      {a.admin_note && <div className="text-xs text-muted-foreground line-clamp-2">{a.admin_note}</div>}
                    </TableCell>
                    <TableCell>
                      {a.course ? (
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{a.course.title}</Badge>
                          {a.course_external_url && (
                            <a className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1" href={a.course_external_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3" /> external
                            </a>
                          )}
                        </span>
                      ) : (
                        a.course_external_url ? (
                          <a className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1" href={a.course_external_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3" /> external
                          </a>
                        ) : <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>{Number(a.amount).toFixed(2)} USD</TableCell>
                    <TableCell>{new Date(a.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteAllocation(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsor.transactions.map((t) => (
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
    </AppLayout>
  );
}
