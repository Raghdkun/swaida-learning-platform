import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
    LayoutDashboard, 
    BookOpen, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: ReactNode;
    auth: {
        user: any;
    };
    className?: string;
}

export default function AdminLayout({ children, auth, className }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </div>
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">
                            Admin Panel
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="px-3 py-2">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {auth.user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">
                                        {auth.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Administrator
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-3 space-y-1">
                            <Link
                                href="/profile"
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <Settings className="mr-3 h-5 w-5" />
                                Profile Settings
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <BookOpen className="mr-3 h-5 w-5" />
                                View Site
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome back, {auth.user?.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className={cn("p-6", className)}>
                    {children}
                </main>
            </div>
        </div>
    );
}