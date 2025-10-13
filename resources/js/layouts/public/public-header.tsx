import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';

interface PublicHeaderProps {
    auth?: {
        user: any;
    };
}

export function PublicHeader({ auth }: PublicHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, locale } = useTranslation();

    const navigation = [
        { name: t('common.home'), href: '/' },
        { name: t('common.courses'), href: '/courses' },
    ];

    return (
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border sticky top-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="flex w-full items-center justify-between py-3 sm:py-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-colors group-hover:text-primary/80" />
                            <span className="text-lg sm:text-xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                                {t('common.site_name')}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-muted/50"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Language Switcher and Auth */}
                    <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-4">
                        <LanguageSwitcher currentLocale={locale} />
                        
                        
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <LanguageSwitcher currentLocale={locale} />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4 bg-background/95 backdrop-blur">
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            

                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
