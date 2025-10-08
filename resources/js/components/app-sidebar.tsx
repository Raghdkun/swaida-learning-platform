import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as coursesIndex, create as coursesCreate } from '@/routes/dashboard/courses';
import { index as tagsIndex, create as tagsCreate } from '@/routes/dashboard/tags';
import { index as categoriesIndex, create as categoriesCreate } from '@/routes/dashboard/categories';
import { index as levelsIndex } from '@/routes/dashboard/levels';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Tag, FolderOpen, TrendingUp } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Courses',
        href: coursesIndex.url(),
        icon: BookOpen,
        items: [
            {
                title: 'All Courses',
                href: coursesIndex.url(),
            },
            {
                title: 'Add Course',
                href: coursesCreate.url(),
            },
        ],
    },
    {
        title: 'Tags',
        href: tagsIndex.url(),
        icon: Tag,
        items: [
            {
                title: 'All Tags',
                href: tagsIndex.url(),
            },
            {
                title: 'Add Tag',
                href: tagsCreate.url(),
            },
        ],
    },
    {
        title: 'Categories',
        href: categoriesIndex.url(),
        icon: FolderOpen,
        items: [
            {
                title: 'All Categories',
                href: categoriesIndex.url(),
            },
            {
                title: 'Add Category',
                href: categoriesCreate.url(),
            },
        ],
    },
    {
        title: 'Levels',
        href: levelsIndex.url(),
        icon: TrendingUp,
    },
    {
        title: 'Payment Requests',
        href: '/dashboard/course-payments',
        icon: Folder,
    }
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
