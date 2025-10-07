import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DashboardPagination } from '@/components/dashboard-pagination';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Plus, Search, ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { PaginatedData } from '@/types';
import { index, create, show, edit, destroy, bulkDestroy } from '@/routes/dashboard/tags';

interface Tag {
    id: number;
    name: string;
    slug: string;
    courses_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    tags: PaginatedData<Tag>;
    filters: {
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function TagsIndex({ tags, filters }: Props) {

    const breadcrumbs: BreadcrumbItemType[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tags', href: '/dashboard/tags' }
    ];

    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [search, setSearch] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url({
            search,
            sort_by: sortBy,
            sort_order: sortOrder,
        }), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(index.url({
            search,
            sort_by: column,
            sort_order: newSortOrder,
        }), {}, {
            preserveState: true,
            replace: true,
        });
        setSortBy(column);
        setSortOrder(newSortOrder);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTags(tags.data.map(tag => tag.id));
        } else {
            setSelectedTags([]);
        }
    };

    const handleSelectTag = (tagId: number, checked: boolean) => {
        if (checked) {
            setSelectedTags([...selectedTags, tagId]);
        } else {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        }
    };

    const handleBulkDelete = () => {
        if (selectedTags.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedTags.length} tag(s)?`)) {
            router.delete(bulkDestroy.url(), {
                data: { ids: selectedTags },
                onSuccess: () => setSelectedTags([]),
            });
        }
    };

    const handleDelete = (tagId: number) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            router.delete(destroy.url({ tag: tagId }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tags Management" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tags Management</h1>
                        <p className="text-muted-foreground">
                            Manage course tags and their associations
                        </p>
                    </div>
                    <Link href={create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tag
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
                                    placeholder="Search tags..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="created_at">Created Date</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Order" />
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
                {selectedTags.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {selectedTags.length} tag(s) selected
                                </span>
                                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tags Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tags ({tags?.total || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedTags.length === tags.data.length && tags.data.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('name')}>
                                            Name
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Courses</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('created_at')}>
                                            Created
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.data.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedTags.includes(tag.id)}
                                                onCheckedChange={(checked) => handleSelectTag(tag.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{tag.name}</div>
                                                <div className="text-sm text-muted-foreground">{tag.slug}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {tag.courses_count} course{tag.courses_count !== 1 ? 's' : ''}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(tag.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex space-x-2">
                                                <Link href={show.url({ tag: tag.id })}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={edit.url({ tag: tag.id })}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(tag.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <DashboardPagination data={tags} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}