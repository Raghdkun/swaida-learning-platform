import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerLinks = {
    platform: [
      { name: t('footer.browse_courses'), href: '/courses' },
      { name: t('footer.featured'), href: '/' },
    ],
    support: [
      { name: t('footer.help_center'), href: '/help' },
    ],
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  {t('common.site_name')}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                {t('footer.platform')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                {t('footer.support')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              {t('footer.copyright', { year: currentYear })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
