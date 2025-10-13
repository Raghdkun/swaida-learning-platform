// resources/js/Pages/Sponsor/ChangePassword.tsx
import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function SponsorChangePassword() {
  const { t } = useTranslation();
  const { data, setData, put, processing, errors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`change-password`);
  };

  return (
    <>
      <Head title={t('sponsor_change_password.title')} />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> {t('sponsor_change_password.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('sponsor_change_password.subtitle')}
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">{t('sponsor_change_password.current')}</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={data.current_password}
                  onChange={(e) => setData('current_password', e.target.value)}
                  className={errors.current_password ? 'border-destructive' : ''}
                />
                {errors.current_password && (
                  <p className="text-sm text-destructive">{errors.current_password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('sponsor_change_password.new')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">{t('sponsor_change_password.confirm')}</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? t('sponsor_change_password.updating') : t('sponsor_change_password.update')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
