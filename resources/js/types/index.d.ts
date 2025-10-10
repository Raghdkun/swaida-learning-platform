import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth { user: User | null; }

export interface BreadcrumbItem { title: string; href: string; }

export interface NavGroup { title: string; items: NavItem[]; }

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
  [key: string]: unknown;
}

// Course-related interfaces
export interface Category {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: number;
  title: string;
  description: string;
  external_url: string;
  duration: number;
  platform: string;
  image?: string;
  image_url?: string;
  category_id: number;
  have_cert: boolean;
  level: CourseLevel;
  price?: number | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  tags?: Tag[];
  // Computed
  is_paid: boolean;
  formatted_price: string | null;
}

// API Response interfaces
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
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

// Inertia paginator (some places)
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean; }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type CourseType = 'free' | 'paid';
export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'title' | 'popularity';

export interface CourseFilters {
  search?: string;
  // Accept slug or id string (backend normalizes)
  category?: string;
  platform?: string;
  level?: CourseLevel;
  have_cert?: boolean;
  // slugs array on the UI; backend maps to IDs
  tags?: string[];
  course_type?: CourseType;
  type?: CourseType; // accepted for compatibility
  min_price?: number;
  max_price?: number;
  sort?: SortOption;
  page?: number;
}

export interface FilterOptions {
  categories: Category[];
  platforms: string[];
  levels: string[];
  tags: Tag[];
  price_range?: { min: number; max: number };
  course_types?: { free: number; paid: number };
}

export interface DashboardStats {
  total_courses: number;
  total_categories: number;
  total_tags: number;
  courses_by_category: Array<{ category: string; count: number; }>;
  courses_by_platform: Array<{ platform: string; count: number; }>;
  courses_by_level: Array<{ level: string; count: number; }>;
}
