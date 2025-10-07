import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Edit, 
    Eye, 
    Trash2,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { DashboardPagination } from '@/components/dashboard-pagination';

interface Course {
    id: number;
    title: string;
    description: string;
    external_url: string;
    duration: string | null;
    platform: string;
    image: string | null;
    image_url?: string | null; // Keep for backward compatibility during transition
    level: 'beginner' | 'intermediate' | 'advanced';
    have_cert: boolean;
    price: number | null;
    category: {
        id: number;
        name: string;
    };
    tags: Array<{
        id: number;
        name: string;
    }>;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    courses: PaginatedData<Course>;
    categories: Category[];
    levels: string[];
    filters: {
        search?: string;
        category?: string;
        level?: string;
        type?: string;
        sort?: string;
        direction?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Courses', href: '/dashboard/courses' },
];

const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function CoursesIndex({ courses, categories, levels, filters }: Props) {
    // Debug: Log the courses data structure for comparison
    

    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/courses', { ...filters, search: searchTerm }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilter = (key: string, value: string) => {
        const filterValue = value === 'all' ? undefined : value;
        router.get('/dashboard/courses', { ...filters, [key]: filterValue }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (column: string) => {
        const direction = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get('/dashboard/courses', { ...filters, sort: column, direction }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (courseId: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(`/dashboard/courses/${courseId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedCourses.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedCourses.length} courses?`)) {
            router.delete('/dashboard/courses', {
                data: { ids: selectedCourses },
                preserveScroll: true,
                onSuccess: () => setSelectedCourses([]),
            });
        }
    };

    const toggleCourseSelection = (courseId: number) => {
        setSelectedCourses(prev => 
            prev.includes(courseId) 
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const toggleAllCourses = () => {
        setSelectedCourses(prev => 
            prev.length === courses.data.length 
                ? [] 
                : courses.data.map(course => course.id)
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Courses" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                        <p className="text-muted-foreground">
                            Manage your learning platform courses
                        </p>
                    </div>
                    <Link href="/dashboard/courses/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Course
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search courses..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </form>
                            
                            <Select
                                value={filters.category || 'all'}
                                onValueChange={(value) => handleFilter('category', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.level || 'all'}
                                onValueChange={(value) => handleFilter('level', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {levels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.type || 'all'}
                                onValueChange={(value) => handleFilter('type', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="free">Free Courses</SelectItem>
                                    <SelectItem value="paid">Paid Courses</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button type="submit" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedCourses.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {selectedCourses.length} course(s) selected
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Courses Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedCourses.length === courses.data.length && courses.data.length > 0}
                                            onCheckedChange={toggleAllCourses}
                                        />
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('title')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Title
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Certificate</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('created_at')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Created
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.data.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCourses.includes(course.id)}
                                                onCheckedChange={() => toggleCourseSelection(course.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">{course.title}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-2">
                                                    {course.description}
                                                </div>
                                                {course.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {course.tags.slice(0, 3).map((tag) => (
                                                            <Badge key={tag.id} variant="secondary" className="text-xs">
                                                                {tag.name}
                                                            </Badge>
                                                        ))}
                                                        {course.tags.length > 3 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{course.tags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{course.category.name}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={levelColors[course.level]}>
                                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.platform}</TableCell>
                                        <TableCell>
                                            {course.price ? (
                                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    ${Number(course.price).toFixed(2)}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    Free
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {course.have_cert ? (
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    Yes
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">No</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/courses/${course.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/courses/${course.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(course.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        {courses.data.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No courses found.</p>
                                <Link href="/dashboard/courses/create">
                                    <Button className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create your first course
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                <DashboardPagination data={courses} />
            </div>
        </AppLayout>
    );
}