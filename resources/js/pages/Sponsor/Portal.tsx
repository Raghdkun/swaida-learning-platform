import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, LogOut, ExternalLink, User, Phone, Mail, Calendar, Sparkles, TrendingUp, Users, CreditCard } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

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
  const { t } = useTranslation();

  const logout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(`logout`);
  };

  const totalAllocations = sponsor.allocations.reduce((sum, allocation) => sum + Number(allocation.amount), 0);
  const totalStudents = new Set(sponsor.allocations.map(a => a.recipient_full_name)).size;

  return (
    <>
      <Head title={t('sponsor.title')} />
      <div className="container mx-auto px-4 py-10 space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-5 duration-700">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              {t('sponsor.welcome', { name: sponsor.full_name })}
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('sponsor.last_login')}{' '}
              {sponsor.last_login_at ? new Date(sponsor.last_login_at).toLocaleString() : t('sponsor.none')}
            </p>
          </div>
          <form onSubmit={logout} className="flex gap-3">
            <Button asChild variant="outline" className="transition-all duration-200 hover:scale-105 active:scale-95 group">
              <Link href="/sponsor/change-password">
                <User className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                {t('sponsor.change_password')}
              </Link>
            </Button>
            <Button 
              variant="outline" 
              type="submit"
              className="transition-all duration-200 hover:scale-105 active:scale-95 group hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
            >
              <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              {t('common.logout')}
            </Button>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 animate-in fade-in-50 duration-700 delay-200">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                {t('sponsor.contact')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-300">
                <Mail className="h-3 w-3" />
                {sponsor.email}
              </div>
              <div className="text-sm flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-300">
                <Phone className="h-3 w-3" />
                {sponsor.phone || t('sponsor.none')}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-500" />
                {t('sponsor.initial_amount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                <DollarSign className="h-3 w-3" />
                {sponsor.formatted_initial_amount ?? `${Number(sponsor.initial_amount).toFixed(2)} USD`}
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t('sponsor.current_balance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                <DollarSign className="h-3 w-3" />
                {sponsor.formatted_current_amount ?? `${Number(sponsor.current_amount).toFixed(2)} USD`}
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                {t('sponsor.students_supported')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                {totalStudents}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('sponsor.total_allocations')}: {sponsor.allocations.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Allocations */}
        <Card className="animate-in slide-in-from-bottom-5 duration-700 delay-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('sponsor.allocations.title')}
              <Badge variant="secondary" className="ml-2 animate-pulse">
                {sponsor.allocations.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">{t('sponsor.allocations.recipient')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.allocations.course')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.allocations.amount')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.allocations.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsor.allocations.map(a => (
                  <TableRow key={a.id} className="group hover:bg-primary/5 transition-all duration-200 hover:scale-105">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <User className="h-3 w-3" />
                        {a.recipient_full_name}
                      </div>
                      {a.admin_note && (
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-1 group-hover:text-foreground transition-colors duration-300">
                          {a.admin_note}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {a.course ? (
                        <span className="group-hover:text-primary transition-colors duration-300">
                          {a.course.title}
                        </span>
                      ) : (
                        a.course_external_url ? (
                          <a
                            href={a.course_external_url}
                            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 transition-all duration-200 hover:scale-105"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 transition-transform duration-200 hover:scale-110" /> 
                            {t('sponsor.external')}
                          </a>
                        ) : t('sponsor.none')
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="group-hover:scale-105 transition-transform duration-300">
                        {Number(a.amount).toFixed(2)} USD
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {new Date(a.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sponsor.allocations.length === 0 && (
              <div className="py-12 text-center text-muted-foreground animate-in fade-in-50 duration-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {t('sponsor.allocations.empty')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="animate-in slide-in-from-bottom-5 duration-700 delay-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t('sponsor.transactions.title')}
              <Badge variant="secondary" className="ml-2 animate-pulse">
                {sponsor.transactions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">{t('sponsor.transactions.type')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.transactions.amount')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.transactions.reference')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.transactions.notes')}</TableHead>
                  <TableHead className="font-semibold">{t('sponsor.transactions.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsor.transactions.map(tnx => (
                  <TableRow key={tnx.id} className="group hover:bg-primary/5 transition-all duration-200 hover:scale-105">
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`group-hover:scale-105 transition-transform duration-300 ${
                          tnx.type === 'top_up' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : tnx.type === 'refund'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {t(`sponsor.transactions.types.${tnx.type}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium group-hover:text-primary transition-colors duration-300">
                      {Number(tnx.amount).toFixed(2)} USD
                    </TableCell>
                    <TableCell className="text-sm group-hover:text-foreground transition-colors duration-300">
                      {tnx.reference || t('sponsor.none')}
                    </TableCell>
                    <TableCell className="text-sm group-hover:text-foreground transition-colors duration-300">
                      {tnx.notes || t('sponsor.none')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {new Date(tnx.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sponsor.transactions.length === 0 && (
              <div className="py-12 text-center text-muted-foreground animate-in fade-in-50 duration-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {t('sponsor.transactions.empty')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}