import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PublicHeaderProps {
    auth?: {
        user: any;
    };
}

export function PublicHeader({ auth }: PublicHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
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
                                Swaida Learning
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

                    {/* Auth Buttons
                    <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-4">
                        {auth?.user ? (
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                <span className="text-sm text-muted-foreground hidden lg:inline">
                                    Welcome, {auth.user.name}
                                </span>
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link 
                                    href="/logout" 
                                    method="post" 
                                    as="button"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-muted-foreground hover:text-foreground"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div> */}

                    {/* Mobile menu button */}
                    <div className="md:hidden">
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
                            
                            {/* <div className="border-t border-border pt-4 mt-4">
                                {auth?.user ? (
                                    <div className="space-y-1">
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            Welcome, {auth.user.name}
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <Link
                                            href="/login"
                                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="block px-3 py-2 text-base font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors duration-200"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}