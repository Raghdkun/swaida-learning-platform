import { useState } from 'react';
import { Search, Filter, X, ChevronDown, DollarSign, Award, BookOpen, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CourseFilters, FilterOptions } from '@/types';

interface CourseFiltersProps {
    filters: CourseFilters;
    filterOptions: FilterOptions | null;
    onFiltersChange: (filters: Partial<CourseFilters>) => void;
    onResetFilters: () => void;
    loading?: boolean;
}

export function CourseFiltersComponent({ 
    filters, 
    filterOptions, 
    onFiltersChange, 
    onResetFilters,
    loading = false 
}: CourseFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSearchChange = (value: string) => {
        onFiltersChange({ search: value });
    };

    const handleCategoryChange = (value: string) => {
        onFiltersChange({ category: value === 'all' ? undefined : value });
    };

    const handlePlatformChange = (value: string) => {
        onFiltersChange({ platform: value === 'all' ? undefined : value });
    };

    const handleLevelChange = (value: string) => {
        onFiltersChange({ level: value === 'all' ? undefined : value });
    };

    const handleCourseTypeChange = (value: string) => {
        onFiltersChange({ course_type: value === 'all' ? undefined : value as 'free' | 'paid' });
    };

    const handleCertificateChange = (checked: boolean) => {
        onFiltersChange({ have_cert: checked ? true : undefined });
    };

    const handleTagToggle = (tagSlug: string) => {
        const currentTags = filters?.tags || [];
        const newTags = currentTags.includes(tagSlug)
            ? currentTags.filter(tag => tag !== tagSlug)
            : [...currentTags, tagSlug];
        
        onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined });
    };

    const getActiveFiltersCount = () => {
        if (!filters) return 0;
        let count = 0;
        if (filters?.search) count++;
        if (filters?.category) count++;
        if (filters?.platform) count++;
        if (filters?.level) count++;
        if (filters?.course_type) count++;
        if (filters?.have_cert) count++;
        if (filters?.tags && filters.tags.length > 0) count++;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <>
            <div className="space-y-6">
                {/* Enhanced Search Bar */}
                <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                placeholder="Search courses by title, description, or instructor..."
                                value={filters?.search || ''}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-12 h-14 text-base border-2 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Filter Toggle */}
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Filter className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Advanced Filters</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Refine your search with detailed options
                                            </p>
                                        </div>
                                        {activeFiltersCount > 0 && (
                                            <Badge variant="default" className="ml-2 px-3 py-1 bg-primary text-primary-foreground">
                                                {activeFiltersCount} active
                                            </Badge>
                                        )}
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-6">
                        <Card className="border-2 shadow-lg">
                            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Filter className="h-5 w-5" />
                                        Filter Options
                                    </CardTitle>
                                    {activeFiltersCount > 0 && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={onResetFilters}
                                            className="text-muted-foreground hover:text-foreground border-dashed"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                {/* Quick Filters Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Course Type Filter */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-primary" />
                                            Course Type
                                        </Label>
                                        <Select 
                            value={filters?.course_type || 'all'} 
                            onValueChange={handleCourseTypeChange}
                            disabled={loading}
                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Courses</SelectItem>
                                                <SelectItem value="free">
                                                    <div className="flex items-center gap-2">
                                                        <span>Free Courses</span>
                                                        {filterOptions?.course_types?.free && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {filterOptions.course_types.free}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="paid">
                                                    <div className="flex items-center gap-2">
                                                        <span>Paid Courses</span>
                                                        {filterOptions?.course_types?.paid && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {filterOptions.course_types.paid}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            Category
                                        </Label>
                                        <Select 
                            value={filters?.category || 'all'} 
                            onValueChange={handleCategoryChange}
                            disabled={loading || !filterOptions?.categories}
                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {filterOptions?.categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.slug}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>{category.name}</span>
                                                            {category.courses_count && (
                                                                <Badge variant="secondary" className="text-xs ml-2">
                                                                    {category.courses_count}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Platform Filter */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">Platform</Label>
                                        <Select 
                            value={filters?.platform || 'all'} 
                            onValueChange={handlePlatformChange}
                            disabled={loading || !filterOptions?.platforms}
                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Platforms</SelectItem>
                                                {filterOptions?.platforms.map((platform) => (
                                                    <SelectItem key={platform} value={platform}>
                                                        {platform}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Level Filter */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">Level</Label>
                                        <Select 
                            value={filters?.level || 'all'} 
                            onValueChange={handleLevelChange}
                            disabled={loading}
                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Levels</SelectItem>
                                                <SelectItem value="beginner">
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 border">
                                                        Beginner
                                                    </Badge>
                                                </SelectItem>
                                                <SelectItem value="intermediate">
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 border">
                                                        Intermediate
                                                    </Badge>
                                                </SelectItem>
                                                <SelectItem value="advanced">
                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                        Advanced
                                                    </Badge>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Separator />

                                {/* Certificate Filter */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Award className="h-4 w-4 text-primary" />
                                        Certificate Options
                                    </Label>
                                    <Card className="p-4 bg-muted/30 border-dashed">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                id="certificate"
                                checked={filters?.have_cert || false}
                                onCheckedChange={handleCertificateChange}
                                disabled={loading}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                                            <Label htmlFor="certificate" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                                <Award className="h-4 w-4" />
                                                Only show courses with certificates
                                            </Label>
                                        </div>
                                    </Card>
                                </div>

                                {/* Tags Filter */}
                                {filterOptions?.tags && filterOptions.tags.length > 0 && (
                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <TagIcon className="h-4 w-4 text-primary" />
                                            Popular Tags
                                        </Label>
                                        <Card className="p-4 bg-muted/20 border-dashed">
                                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                                {filterOptions.tags.map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant={filters?.tags?.includes(tag.slug) ? "default" : "outline"}
                                                        className={`cursor-pointer transition-all duration-200 text-sm px-3 py-2 hover:scale-105 ${
                                                            filters?.tags?.includes(tag.slug) 
                                                                ? "bg-primary text-primary-foreground shadow-md" 
                                                                : "hover:bg-primary/10 hover:border-primary/50"
                                                        }`}
                                                        onClick={() => handleTagToggle(tag.slug)}
                                                    >
                                                        {tag.name}
                                                        {tag.courses_count && (
                                                            <span className="ml-2 text-xs opacity-70 bg-background/20 px-1.5 py-0.5 rounded">
                                                                {tag.courses_count}
                                                            </span>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            {/* Enhanced Active Filters Display */}
            {activeFiltersCount > 0 && (
                <Card className="border-l-4 border-l-primary bg-primary/5">
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-primary">Active Filters</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {activeFiltersCount}
                                    </Badge>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={onResetFilters}
                                    className="text-xs h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-destructive/10"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Clear all
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {filters?.search && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <Search className="h-3 w-3" />
                                        <span className="text-xs font-medium">Search:</span>
                                        <span className="text-xs">{filters.search.length > 20 ? `${filters.search.substring(0, 20)}...` : filters.search}</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ search: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters?.course_type && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <DollarSign className="h-3 w-3" />
                                        <span className="text-xs font-medium">Type:</span>
                                        <span className="text-xs capitalize">{filters.course_type}</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ course_type: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters?.category && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <BookOpen className="h-3 w-3" />
                                        <span className="text-xs font-medium">Category:</span>
                                        <span className="text-xs">{filterOptions?.categories.find(c => c.slug === filters.category)?.name}</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ category: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters?.platform && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <span className="text-xs font-medium">Platform:</span>
                                        <span className="text-xs">{filters.platform}</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ platform: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters?.level && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <span className="text-xs font-medium">Level:</span>
                                        <span className="text-xs capitalize">{filters.level}</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ level: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters?.have_cert && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <Award className="h-3 w-3" />
                                        <span className="text-xs">With Certificate</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ have_cert: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters?.tags && filters.tags.length > 0 && (
                                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                                        <TagIcon className="h-3 w-3" />
                                        <span className="text-xs font-medium">Tags:</span>
                                        <span className="text-xs">{filters.tags.length} selected</span>
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                                            onClick={() => onFiltersChange({ tags: undefined })}
                                        />
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

export { CourseFiltersComponent as CourseFilters };