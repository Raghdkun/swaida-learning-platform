import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function SponsorLogin() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`login`);
  };

  return (
    <>
      <Head title={t('sponsor_login.title')} />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t('sponsor_login.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('sponsor_login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('sponsor_login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(v) => setData('remember', Boolean(v))}
                />
                <Label htmlFor="remember">{t('sponsor_login.remember')}</Label>
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                <LogIn className="mr-2 h-4 w-4" />
                {processing ? t('sponsor_login.submitting') : t('sponsor_login.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
