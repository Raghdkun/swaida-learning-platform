import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';

export default function SponsorLogin() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`login`);
  };

  return (
    <>
      <Head title={t('sponsor_login.title')} />
      <div className="container mx-auto px-4 py-16 max-w-md animate-in fade-in-50 duration-500">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              {t('sponsor_login.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2 group">
                <Label htmlFor="email" className="group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('sponsor_login.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`transition-all duration-200 hover:scale-105 focus:scale-105 ${
                    errors.email ? 'border-destructive' : 'hover:border-primary/50'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive animate-pulse flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <Label htmlFor="password" className="group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t('sponsor_login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive animate-pulse flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 group cursor-pointer p-2 rounded-lg hover:bg-primary/5 transition-all duration-200">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(v) => setData('remember', Boolean(v))}
                  className="transition-all duration-200 group-hover:scale-110 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="remember" className="cursor-pointer group-hover:text-primary transition-colors duration-200">
                  {t('sponsor_login.remember')}
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group" 
                disabled={processing}
                size="lg"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 animate-pulse" />
                    {t('sponsor_login.submitting')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    {t('sponsor_login.submit')}
                  </div>
                )}
              </Button>

              {/* Additional Links */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {t('sponsor_login.need_help')}{' '}
                  <Link 
                    href="/contact" 
                    className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium hover:underline"
                  >
                    {t('sponsor_login.contact_support')}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}