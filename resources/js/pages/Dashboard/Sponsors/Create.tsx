// resources/js/Pages/Dashboard/Sponsors/Create.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft } from 'lucide-react';

export default function SponsorCreate() {
  const { data, setData, post, processing, errors } = useForm({
    full_name: '',
    phone: '',
    email: '',
    initial_amount: '',
    current_amount: '',
    password: '',
    password_confirmation: '',
    require_change: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/dashboard/sponsors');
  };

  return (
    <AppLayout>
      <Head title="Create Sponsor" />
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/sponsors`}><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <h1 className="text-2xl font-bold">Create Sponsor</h1>
        </div>
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input value={data.full_name} onChange={e=>setData('full_name', e.target.value)} className={errors.full_name ? 'border-destructive':''}/>
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={data.email} onChange={e=>setData('email', e.target.value)} className={errors.email ? 'border-destructive':''}/>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={data.phone} onChange={e=>setData('phone', e.target.value)} className={errors.phone ? 'border-destructive':''}/>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <Label>Initial Amount</Label>
                <Input type="number" step="0.01" value={data.initial_amount} onChange={e=>setData('initial_amount', e.target.value)} className={errors.initial_amount ? 'border-destructive':''}/>
                {errors.initial_amount && <p className="text-sm text-destructive">{errors.initial_amount}</p>}
              </div>
              <div>
                <Label>Current Amount</Label>
                <Input type="number" step="0.01" value={data.current_amount} onChange={e=>setData('current_amount', e.target.value)} className={errors.current_amount ? 'border-destructive':''}/>
                {errors.current_amount && <p className="text-sm text-destructive">{errors.current_amount}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Set Password</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Password</Label>
                <Input type="password" value={data.password} onChange={e=>setData('password', e.target.value)} className={errors.password ? 'border-destructive':''}/>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" value={data.password_confirmation} onChange={e=>setData('password_confirmation', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={data.require_change} onCheckedChange={v=>setData('require_change', Boolean(v))} id="require_change" />
                <Label htmlFor="require_change">Require password change on first login</Label>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Button type="submit" disabled={processing}><Save className="h-4 w-4 mr-2" />Create</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
