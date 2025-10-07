// Fixed pagination structure and safety checks
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { index, create, show, edit, destroy, bulkDestroy } from '@/routes/dashboard/categories';
import { Category, type BreadcrumbItem, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/dashboard/categories' },
];



interface Props {
    categories: PaginatedData<Category>;
    filters: {
        search?: string;
        sort?: string;
        direction?: string;
    };
}

export default function CategoriesIndex({ categories, filters }: Props) {
    // Ensure data is properly initialized with complete structure
    const safeCategories = categories || { 
        data: [], 
        meta: { 
            current_page: 1, 
            from: 0, 
            last_page: 1, 
            per_page: 15, 
            to: 0, 
            total: 0 
        }, 
        links: { 
            first: '', 
            last: '', 
            prev: null, 
            next: null 
        } 
    };
    
    // Ensure data is always an array
    if (!Array.isArray(safeCategories.data)) {
        safeCategories.data = [];
    }
    
    const safeFilters = filters || { search: '', sort: 'name', direction: 'asc' };
    
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(typeof safeFilters.search === 'string' ? safeFilters.search : '');
    const [sortBy, setSortBy] = useState(typeof safeFilters.sort === 'string' ? safeFilters.sort : 'name');
    const [sortDirection, setSortDirection] = useState(typeof safeFilters.direction === 'string' ? safeFilters.direction : 'asc');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url({
            search: searchTerm,
            sort: sortBy,
            direction: sortDirection,
        }), {}, { preserveState: true });
    };

    const handleSort = (field: string) => {
        const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        router.get(index.url({
            search: searchTerm,
            sort: field,
            direction: newDirection,
        }), {}, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && safeCategories.data && Array.isArray(safeCategories.data)) {
            setSelectedCategories(safeCategories.data.map(category => category.id));
        } else {
            setSelectedCategories([]);
        }
    };

    const handleSelectCategory = (categoryId: number, checked: boolean) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, categoryId]);
        } else {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        }
    };

    const handleBulkDelete = () => {
        router.delete(bulkDestroy.url(), {
            data: { ids: selectedCategories },
            onSuccess: () => setSelectedCategories([]),
        });
    };

    const handleDelete = (categoryId: number) => {
        router.delete(destroy.url(categoryId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories Management" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">
                            Manage course categories
                        </p>
                    </div>
                    <Link href={create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="courses_count">Courses Count</SelectItem>
                                    <SelectItem value="created_at">Created Date</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortDirection} onValueChange={setSortDirection}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Direction" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                    <SelectItem value="desc">Descending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedCategories.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Selected
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the selected categories.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete Categories
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories ({categories?.total || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedCategories.length === (safeCategories.data?.length || 0) && (safeCategories.data?.length || 0) > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                        {sortBy === 'name' && (
                                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('courses_count')}
                                    >
                                        Courses
                                        {sortBy === 'courses_count' && (
                                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {safeCategories.data?.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCategories.includes(category.id)}
                                                onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-muted px-1 py-0.5 rounded">{category.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{category.courses_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={show.url(category.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={edit.url(category.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the category
                                                                "{category.name}".
                                                                {category.courses_count > 0 && (
                                                                    <span className="block mt-2 font-medium text-destructive">
                                                                        This category has {category.courses_count} associated course{category.courses_count !== 1 ? 's' : ''}.
                                                                    </span>
                                                                )}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(category.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete Category
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {(safeCategories.data?.length || 0) === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No categories found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {safeCategories.last_page && safeCategories.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {safeCategories.from || 0} to{' '}
                            {safeCategories.to || 0} of{' '}
                            {safeCategories.total || 0} results
                        </p>
                        <div className="flex gap-2">
                            {safeCategories.links?.prev && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(safeCategories.links.prev!)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                            )}
                            {safeCategories.links?.next && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(safeCategories.links.next!)}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}