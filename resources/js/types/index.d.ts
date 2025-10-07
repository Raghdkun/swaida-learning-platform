import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Course-related interfaces
export interface Category {
    id: number;
    name: string;
    slug: string;
    courses_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    courses_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    external_url: string;
    duration: number;
    platform: string;
    image?: string;
    image_url?: string; // Keep for backward compatibility during transition
    category_id: number;
    have_cert: boolean;
    level: 'beginner' | 'intermediate' | 'advanced';
    price?: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    tags?: Tag[];
    // Computed attributes
    is_paid: boolean;
    formatted_price: string;
}

// API Response interfaces
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface CourseFilters {
    search?: string;
    category?: string;
    platform?: string;
    level?: string;
    have_cert?: boolean;
    duration_min?: number;
    duration_max?: number;
    tags?: string[];
    course_type?: 'free' | 'paid';
    min_price?: number;
    max_price?: number;
}

export interface FilterOptions {
    categories: Category[];
    platforms: string[];
    levels: string[];
    tags: Tag[];
    price_range?: {
        min: number;
        max: number;
    };
    course_types?: {
        free: number;
        paid: number;
    };
}

export interface DashboardStats {
    total_courses: number;
    total_categories: number;
    total_tags: number;
    courses_by_category: Array<{
        category: string;
        count: number;
    }>;
    courses_by_platform: Array<{
        platform: string;
        count: number;
    }>;
    courses_by_level: Array<{
        level: string;
        count: number;
    }>;
}
