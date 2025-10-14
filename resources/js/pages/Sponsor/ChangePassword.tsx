// resources/js/Pages/Sponsor/ChangePassword.tsx
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Shield, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';

export default function SponsorChangePassword() {
  const { t } = useTranslation();
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`change-password`);
  };

  const handleReset = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <>
      <Head title={t('sponsor_change_password.title')} />
      <div className="container mx-auto px-4 py-16 max-w-md animate-in fade-in-50 duration-500">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary animate-pulse" /> 
              {t('sponsor_change_password.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t('sponsor_change_password.subtitle')}
            </p>
            <form onSubmit={submit} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2 group">
                <Label htmlFor="current_password" className="group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t('sponsor_change_password.current')}
                </Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    className={`transition-all duration-200 hover:scale-105 focus:scale-105 pr-10 ${
                      errors.current_password ? 'border-destructive' : 'hover:border-primary/50'
                    }`}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    )}
                  </Button>
                </div>
                {errors.current_password && (
                  <p className="text-sm text-destructive animate-pulse flex items-center gap-1">
                    {errors.current_password}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2 group">
                <Label htmlFor="password" className="group-hover:text-primary transition-colors duration-200">
                  {t('sponsor_change_password.new')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showNewPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`transition-all duration-200 hover:scale-105 focus:scale-105 pr-10 ${
                      errors.password ? 'border-destructive' : 'hover:border-primary/50'
                    }`}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive animate-pulse">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 group">
                <Label htmlFor="password_confirmation" className="group-hover:text-primary transition-colors duration-200">
                  {t('sponsor_change_password.confirm')}
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="transition-all duration-200 hover:scale-105 focus:scale-105 pr-10 hover:border-primary/50"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={processing}
                  className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95 group border-dashed"
                >
                  <RotateCcw className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-180" />
                  {t('common.reset')}
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95 group" 
                  disabled={processing}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      {t('sponsor_change_password.updating')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      {t('sponsor_change_password.update')}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}