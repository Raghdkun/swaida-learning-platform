import { Link } from '@inertiajs/react';
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function PublicFooter() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { name: 'Browse Courses', href: '/courses' },
            // { name: 'Categories', href: '/courses?category=' },
            { name: 'Featured', href: '/' },
        ],
        // company: [
        //     // { name: 'About Us', href: '/about' },
        //     // { name: 'Contact', href: '/contact' },
        //     // { name: 'Privacy Policy', href: '/privacy' },
        //     // { name: 'Terms of Service', href: '/terms' },
        // ],
        support: [
            { name: 'Help Center', href: '/help' },
            // { name: 'Community', href: '/community' },
            // { name: 'FAQ', href: '/faq' },
        ],
    };

    // const socialLinks = [
    //     // { name: 'GitHub', href: '#', icon: Github },
    //     // { name: 'Twitter', href: '#', icon: Twitter },
    //     // { name: 'LinkedIn', href: '#', icon: Linkedin },
    //     // { name: 'Email', href: 'mailto:contact@swaida.com', icon: Mail },
    // ];

    return (
        <footer className="bg-background border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <BookOpen className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold text-foreground">
                                    Swaida Learning
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                Discover and explore the best online courses from top platforms. 
                                Learn new skills, advance your career, and achieve your goals.
                            </p>
                            {/* <div className="flex space-x-4">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                            aria-label={social.name}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    );
                                })}
                            </div> */}
                        </div>

                        {/* Platform Links */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                                Platform
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

                        {/* Company Links
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                                Company
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
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
                        </div> */}

                        {/* Support Links */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
                                Support
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

                {/* Bottom Bar */}
                <div className="border-t border-border py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-muted-foreground text-sm">
                            © {currentYear} Swaida Learning Platform. All rights reserved.
                        </p>
                        {/* <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link
                                href="/privacy"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                            >
                                Terms
                            </Link>
                            <Link
                                href="/cookies"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                            >
                                Cookies
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}